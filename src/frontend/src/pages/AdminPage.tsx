import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  type ContactSubmission,
  type CustomRequest,
  type Order,
  formatPrice,
} from "../types";

export default function AdminPage() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isAdmin() as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: ordersResult } = useQuery<
    [{ ok: Order[] }] | [{ err: string }] | { ok: Order[] } | { err: string }
  >({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return { err: "No actor" };
      return (actor as any).getAllOrders();
    },
    enabled: !!actor && isAdmin === true,
  });

  const { data: requestsResult } = useQuery({
    queryKey: ["customRequests"],
    queryFn: async () => {
      if (!actor) return { err: "No actor" };
      return (actor as any).getCustomRequests();
    },
    enabled: !!actor && isAdmin === true,
  });

  const { data: contactsResult } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return { err: "No actor" };
      return (actor as any).getContacts();
    },
    enabled: !!actor && isAdmin === true,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: string }) => {
      return (actor as any).updateOrderStatus(orderId, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allOrders"] }),
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      return (actor as any).updateCustomRequestStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customRequests"] }),
  });

  const orders: Order[] =
    ordersResult && "ok" in ordersResult ? (ordersResult as any).ok : [];
  const requests: CustomRequest[] =
    requestsResult && "ok" in requestsResult ? (requestsResult as any).ok : [];
  const contacts: ContactSubmission[] =
    contactsResult && "ok" in contactsResult ? (contactsResult as any).ok : [];

  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      pending: "bg-stone text-charcoal",
      paid: "bg-bronze text-ivory",
      processing: "bg-walnut text-ivory",
      shipped: "bg-charcoal text-ivory",
      delivered: "bg-green-700 text-white",
      new: "bg-stone text-charcoal",
      reviewed: "bg-bronze text-ivory",
      "in-progress": "bg-walnut text-ivory",
      completed: "bg-green-700 text-white",
    };
    return m[s] || "bg-stone text-charcoal";
  };

  if (checkingAdmin) {
    return (
      <main className="pt-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-4 w-64" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="pt-40 flex flex-col items-center gap-4"
        style={{ background: "var(--ivory)" }}
      >
        <Shield size={40} strokeWidth={1} style={{ color: "var(--stone)" }} />
        <h1 className="font-serif text-3xl font-light">Access Denied</h1>
        <p className="text-sm opacity-50">
          This area is restricted to administrators.
        </p>
      </main>
    );
  }

  return (
    <main
      className="pt-28 pb-24 px-6 md:px-12 min-h-screen"
      style={{ background: "var(--ivory)" }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-10">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--bronze)" }}
          >
            Admin
          </p>
          <h1 className="font-serif text-4xl font-light">Dashboard</h1>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="bg-stone border-0 mb-8" data-ocid="admin.tab">
            <TabsTrigger
              value="orders"
              className="text-xs tracking-wider uppercase"
            >
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="text-xs tracking-wider uppercase"
            >
              Custom Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="text-xs tracking-wider uppercase"
            >
              Messages ({contacts.length})
            </TabsTrigger>
          </TabsList>

          {/* Orders */}
          <TabsContent value="orders">
            <Table data-ocid="admin.orders.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs tracking-wider uppercase">
                    ID
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Total
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Update
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center opacity-40 py-12"
                      data-ocid="admin.orders.empty_state"
                    >
                      No orders yet
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order, i) => (
                    <TableRow
                      key={order.id.toString()}
                      data-ocid={`admin.orders.row.${i + 1}`}
                    >
                      <TableCell className="text-xs">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{order.customerInfo.name}</p>
                        <p className="text-xs opacity-50">
                          {order.customerInfo.email}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-[10px] px-2 py-1 tracking-wider uppercase ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            updateOrderMutation.mutate({
                              orderId: order.id,
                              status: v,
                            })
                          }
                        >
                          <SelectTrigger className="w-32 text-xs h-8 rounded-none border-stone">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "pending",
                              "paid",
                              "processing",
                              "shipped",
                              "delivered",
                            ].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Custom Requests */}
          <TabsContent value="requests">
            <Table data-ocid="admin.requests.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Category
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Budget
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-xs tracking-wider uppercase">
                    Update
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center opacity-40 py-12"
                      data-ocid="admin.requests.empty_state"
                    >
                      No requests yet
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req, i) => (
                    <TableRow
                      key={req.id.toString()}
                      data-ocid={`admin.requests.row.${i + 1}`}
                    >
                      <TableCell>
                        <p className="text-sm">{req.customerName}</p>
                        <p className="text-xs opacity-50">{req.email}</p>
                      </TableCell>
                      <TableCell className="text-xs">
                        {req.preferredCategory}
                      </TableCell>
                      <TableCell className="text-xs">
                        {req.budgetRange}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-[10px] px-2 py-1 tracking-wider uppercase ${statusColor(req.status)}`}
                        >
                          {req.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={req.status}
                          onValueChange={(v) =>
                            updateRequestMutation.mutate({
                              id: req.id,
                              status: v,
                            })
                          }
                        >
                          <SelectTrigger className="w-36 text-xs h-8 rounded-none border-stone">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "new",
                              "reviewed",
                              "in-progress",
                              "completed",
                            ].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts">
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-center opacity-40 py-12 text-sm">
                  No messages yet
                </p>
              ) : (
                contacts.map((c, i) => (
                  <div
                    key={c.id.toString()}
                    className="p-6 border border-stone"
                    data-ocid={`admin.contacts.row.${i + 1}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-serif text-base font-light">
                          {c.name}
                        </p>
                        <p className="text-xs opacity-50">
                          {c.email} · {c.phone}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm opacity-70 leading-relaxed">
                      {c.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
