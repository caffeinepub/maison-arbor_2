import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Authorization "mo:authorization/Authorization";
import BlobStorage "mo:blob-storage/BlobStorage";
import HttpOutcalls "mo:http-outcalls/HttpOutcalls";

actor MaisonArbor {

  // ─── Types ───────────────────────────────────────────────────────────────

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    material : Text;
    price : Nat; // in paise (INR * 100)
    description : Text;
    imageUrl : Text;
    inStock : Bool;
    featured : Bool;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type CustomerInfo = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
    city : Text;
    pincode : Text;
  };

  type Order = {
    id : Nat;
    customerId : Principal;
    customerInfo : CustomerInfo;
    items : [CartItem];
    total : Nat;
    status : Text; // "pending", "paid", "processing", "shipped", "delivered"
    razorpayOrderId : Text;
    razorpayPaymentId : Text;
    createdAt : Int;
  };

  type CustomRequest = {
    id : Nat;
    customerName : Text;
    email : Text;
    phone : Text;
    description : Text;
    preferredCategory : Text;
    budgetRange : Text;
    fileId : Text;
    status : Text; // "new", "reviewed", "in-progress", "completed"
    submittedAt : Int;
  };

  type ContactSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    submittedAt : Int;
  };

  // ─── State ───────────────────────────────────────────────────────────────

  stable var nextProductId : Nat = 1;
  stable var nextOrderId : Nat = 1;
  stable var nextRequestId : Nat = 1;
  stable var nextContactId : Nat = 1;
  stable var razorpayKeyId : Text = "rzp_test_placeholder";
  stable var razorpayKeySecret : Text = "placeholder_secret";

  stable var productsEntries : [(Nat, Product)] = [];
  stable var ordersEntries : [(Nat, Order)] = [];
  stable var customRequestsEntries : [(Nat, CustomRequest)] = [];
  stable var contactsEntries : [(Nat, ContactSubmission)] = [];
  stable var cartsEntries : [(Text, [CartItem])] = [];

  var products = HashMap.fromIter<Nat, Product>(productsEntries.vals(), 50, Nat.equal, func(n : Nat) : Hash.Hash { Nat32.fromNat(n % 2147483647) });
  var orders = HashMap.fromIter<Nat, Order>(ordersEntries.vals(), 20, Nat.equal, func(n : Nat) : Hash.Hash { Nat32.fromNat(n % 2147483647) });
  var customRequests = HashMap.fromIter<Nat, CustomRequest>(customRequestsEntries.vals(), 20, Nat.equal, func(n : Nat) : Hash.Hash { Nat32.fromNat(n % 2147483647) });
  var contacts = HashMap.fromIter<Nat, ContactSubmission>(contactsEntries.vals(), 20, Nat.equal, func(n : Nat) : Hash.Hash { Nat32.fromNat(n % 2147483647) });
  var carts = HashMap.fromIter<Text, [CartItem]>(cartsEntries.vals(), 50, Text.equal, Text.hash);

  // ─── System Hooks ────────────────────────────────────────────────────────

  system func preupgrade() {
    productsEntries := Iter.toArray(products.entries());
    ordersEntries := Iter.toArray(orders.entries());
    customRequestsEntries := Iter.toArray(customRequests.entries());
    contactsEntries := Iter.toArray(contacts.entries());
    cartsEntries := Iter.toArray(carts.entries());
  };

  system func postupgrade() {
    productsEntries := [];
    ordersEntries := [];
    customRequestsEntries := [];
    contactsEntries := [];
    cartsEntries := [];
    if (products.size() == 0) { seedProducts() };
  };

  // ─── Seed Data ────────────────────────────────────────────────────────────

  func seedProducts() {
    let seed : [Product] = [
      // Centre Tables
      { id = nextProductId; name = "The Arbor Centre Table"; category = "Centre Tables"; material = "Solid Sheesham Wood"; price = 8500000; description = "A statement centrepiece rooted in natural form. Handcrafted from solid Sheesham with a smooth matte finish."; imageUrl = "/assets/generated/prod-arbor-centre.dim_900x900.jpg"; inStock = true; featured = true },
      { id = nextProductId + 1; name = "The Forma Centre Table"; category = "Centre Tables"; material = "Solid Walnut & Steel"; price = 12500000; description = "Clean architectural lines meet industrial precision. Walnut top with brushed steel hairpin legs."; imageUrl = "/assets/generated/cat-centre-tables.dim_800x1000.jpg"; inStock = true; featured = false },
      { id = nextProductId + 2; name = "The Terrà Centre Table"; category = "Centre Tables"; material = "Mango Wood & Ceramic"; price = 6800000; description = "Earthy and grounding. A ceramic slab top rests on a live-edge mango wood base."; imageUrl = "/assets/generated/cat-centre-tables.dim_800x1000.jpg"; inStock = true; featured = false },
      // Coffee Tables
      { id = nextProductId + 3; name = "The Volta Coffee Table"; category = "Coffee Tables"; material = "Solid Walnut"; price = 4800000; description = "Low-slung and confident. The Volta is crafted from a single slab of solid walnut with handturned legs."; imageUrl = "/assets/generated/prod-volta-coffee.dim_900x900.jpg"; inStock = true; featured = true },
      { id = nextProductId + 4; name = "The Slate Coffee Table"; category = "Coffee Tables"; material = "Teak & Cane"; price = 3600000; description = "Rattan cane shelf below, solid teak surface above. A refined take on tropical modernism."; imageUrl = "/assets/generated/cat-coffee-tables.dim_800x1000.jpg"; inStock = true; featured = false },
      { id = nextProductId + 5; name = "The Arch Coffee Table"; category = "Coffee Tables"; material = "Solid Oak"; price = 5500000; description = "Two arched legs supporting a generous oak tabletop. Structural poetry in solid wood."; imageUrl = "/assets/generated/cat-coffee-tables.dim_800x1000.jpg"; inStock = false; featured = false },
      // Teapoys
      { id = nextProductId + 6; name = "The Rove Teapoy"; category = "Teapoys"; material = "Solid Teak with Brass Wheels"; price = 2200000; description = "A bedside companion that moves with you. Solid teak with four premium brass-capped wheels."; imageUrl = "/assets/generated/cat-teapoys.dim_800x1000.jpg"; inStock = true; featured = true },
      { id = nextProductId + 7; name = "The Drift Teapoy"; category = "Teapoys"; material = "Mango Wood & Black Steel"; price = 1800000; description = "Mango wood rounds seated on a minimal black steel frame with smooth rolling castors."; imageUrl = "/assets/generated/cat-teapoys.dim_800x1000.jpg"; inStock = true; featured = false },
      // Sofa Siders
      { id = nextProductId + 8; name = "The Poise Sofa Sider"; category = "Sofa Siders"; material = "Solid Walnut"; price = 1500000; description = "Slim, precise and purposeful. A walnut C-table that slides neatly beside any sofa."; imageUrl = "/assets/generated/cat-sofa-siders.dim_800x1000.jpg"; inStock = true; featured = true },
      { id = nextProductId + 9; name = "The Lean Sofa Sider"; category = "Sofa Siders"; material = "Solid Sheesham & Cane"; price = 1200000; description = "A slender profile with a woven cane shelf. Complements both modern and traditional interiors."; imageUrl = "/assets/generated/cat-sofa-siders.dim_800x1000.jpg"; inStock = true; featured = false },
      // TV Unit Bottoms
      { id = nextProductId + 10; name = "The Base TV Unit"; category = "TV Unit Bottoms"; material = "Solid Walnut & Veneer"; price = 9800000; description = "Low, wide and deeply considered. Hidden cable management and soft-close drawers in solid walnut."; imageUrl = "/assets/generated/cat-tv-units.dim_800x1000.jpg"; inStock = true; featured = true },
      { id = nextProductId + 11; name = "The Plinth TV Unit"; category = "TV Unit Bottoms"; material = "Solid Sheesham"; price = 7500000; description = "A single elongated form with open shelving and a warm Sheesham finish."; imageUrl = "/assets/generated/cat-tv-units.dim_800x1000.jpg"; inStock = true; featured = false },
      // Bar Tables
      { id = nextProductId + 12; name = "The Alto Bar Table"; category = "Bar Tables"; material = "Solid Oak & Brass"; price = 6200000; description = "Counter-height oak top with slender brass-tipped legs. Elevates any home bar setting."; imageUrl = "/assets/generated/cat-bar-tables.dim_800x1000.jpg"; inStock = true; featured = true },
      { id = nextProductId + 13; name = "The Perch Bar Table"; category = "Bar Tables"; material = "Solid Walnut"; price = 5400000; description = "A clean walnut top on four tapered legs. Effortlessly transitions from breakfast counter to evening bar."; imageUrl = "/assets/generated/cat-bar-tables.dim_800x1000.jpg"; inStock = true; featured = false },
      // Garden Sets
      { id = nextProductId + 14; name = "The Grove Garden Set"; category = "Garden Sets"; material = "FSC-Certified Teak"; price = 18500000; description = "Four chairs and a generous table in sustainably sourced teak. Weathers beautifully over time."; imageUrl = "/assets/generated/cat-garden-sets.dim_800x1000.jpg"; inStock = true; featured = true },
      { id = nextProductId + 15; name = "The Patio Bistro Set"; category = "Garden Sets"; material = "Solid Acacia"; price = 12000000; description = "A two-seat bistro table and chair set in solid acacia. Perfect for a private garden corner."; imageUrl = "/assets/generated/cat-garden-sets.dim_800x1000.jpg"; inStock = true; featured = false },
      // Designer Shoe Racks
      { id = nextProductId + 16; name = "The Threshold Shoe Rack"; category = "Designer Shoe Racks"; material = "Solid Walnut & Steel"; price = 3200000; description = "Open shelves in solid walnut on a minimal steel frame. A sculptural entrance statement."; imageUrl = "/assets/generated/cat-shoe-racks.dim_800x1000.jpg"; inStock = true; featured = true },
      { id = nextProductId + 17; name = "The Foyer Shoe Cabinet"; category = "Designer Shoe Racks"; material = "Solid Sheesham"; price = 4500000; description = "A closed cabinet with a fluted door panel. Stores up to 18 pairs with discreet elegance."; imageUrl = "/assets/generated/cat-shoe-racks.dim_800x1000.jpg"; inStock = true; featured = false },
    ];
    for (p in seed.vals()) {
      products.put(p.id, p);
    };
    nextProductId := nextProductId + 18;
  };

  // ─── Products ─────────────────────────────────────────────────────────────

  public query func getProducts() : async [Product] {
    Iter.toArray(products.vals())
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    Array.filter<Product>(Iter.toArray(products.vals()), func(p) { p.category == category })
  };

  public query func getProductById(id : Nat) : async ?Product {
    products.get(id)
  };

  public query func getFeaturedProducts() : async [Product] {
    Array.filter<Product>(Iter.toArray(products.vals()), func(p) { p.featured })
  };

  public shared(msg) func addProduct(product : { name : Text; category : Text; material : Text; price : Nat; description : Text; imageUrl : Text; inStock : Bool; featured : Bool }) : async Result.Result<Nat, Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    let id = nextProductId;
    nextProductId += 1;
    products.put(id, { id; name = product.name; category = product.category; material = product.material; price = product.price; description = product.description; imageUrl = product.imageUrl; inStock = product.inStock; featured = product.featured });
    #ok(id)
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────

  public shared(msg) func addToCart(productId : Nat, quantity : Nat) : async Result.Result<(), Text> {
    let key = Principal.toText(msg.caller);
    switch (products.get(productId)) {
      case null { #err("Product not found") };
      case (?_) {
        let current = Option.get(carts.get(key), []);
        let existing = Array.find<CartItem>(current, func(i) { i.productId == productId });
        let updated = switch (existing) {
          case (?item) {
            Array.map<CartItem, CartItem>(current, func(i) {
              if (i.productId == productId) { { productId = i.productId; quantity = i.quantity + quantity } } else { i }
            })
          };
          case null {
            Array.append(current, [{ productId; quantity }])
          };
        };
        carts.put(key, updated);
        #ok(())
      };
    }
  };

  public shared(msg) func removeFromCart(productId : Nat) : async () {
    let key = Principal.toText(msg.caller);
    let current = Option.get(carts.get(key), []);
    let updated = Array.filter<CartItem>(current, func(i) { i.productId != productId });
    carts.put(key, updated);
  };

  public shared(msg) func updateCartQuantity(productId : Nat, quantity : Nat) : async () {
    let key = Principal.toText(msg.caller);
    let current = Option.get(carts.get(key), []);
    let updated = if (quantity == 0) {
      Array.filter<CartItem>(current, func(i) { i.productId != productId })
    } else {
      Array.map<CartItem, CartItem>(current, func(i) {
        if (i.productId == productId) { { productId = i.productId; quantity } } else { i }
      })
    };
    carts.put(key, updated);
  };

  public shared(msg) func getCart() : async [CartItem] {
    Option.get(carts.get(Principal.toText(msg.caller)), [])
  };

  public shared(msg) func clearCart() : async () {
    carts.put(Principal.toText(msg.caller), []);
  };

  // ─── Orders ───────────────────────────────────────────────────────────────

  public shared(msg) func createOrder(customerInfo : CustomerInfo, items : [CartItem], total : Nat, razorpayOrderId : Text) : async Result.Result<Nat, Text> {
    if (items.size() == 0) { return #err("Cart is empty") };
    let id = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id;
      customerId = msg.caller;
      customerInfo;
      items;
      total;
      status = "pending";
      razorpayOrderId;
      razorpayPaymentId = "";
      createdAt = Time.now();
    };
    orders.put(id, order);
    #ok(id)
  };

  public shared(msg) func confirmPayment(orderId : Nat, razorpayPaymentId : Text) : async Result.Result<(), Text> {
    switch (orders.get(orderId)) {
      case null { #err("Order not found") };
      case (?order) {
        if (not Principal.equal(order.customerId, msg.caller) and not (await Authorization.isAdmin(msg.caller))) {
          return #err("Unauthorized");
        };
        orders.put(orderId, { order with status = "paid"; razorpayPaymentId });
        #ok(())
      };
    }
  };

  public shared(msg) func getOrder(orderId : Nat) : async Result.Result<Order, Text> {
    switch (orders.get(orderId)) {
      case null { #err("Order not found") };
      case (?order) {
        if (not Principal.equal(order.customerId, msg.caller) and not (await Authorization.isAdmin(msg.caller))) {
          return #err("Unauthorized");
        };
        #ok(order)
      };
    }
  };

  public shared(msg) func getAllOrders() : async Result.Result<[Order], Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    #ok(Iter.toArray(orders.vals()))
  };

  public shared(msg) func updateOrderStatus(orderId : Nat, status : Text) : async Result.Result<(), Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    switch (orders.get(orderId)) {
      case null { #err("Order not found") };
      case (?order) {
        orders.put(orderId, { order with status });
        #ok(())
      };
    }
  };

  // ─── Razorpay ─────────────────────────────────────────────────────────────

  public shared(msg) func setRazorpayKeys(keyId : Text, keySecret : Text) : async Result.Result<(), Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    razorpayKeyId := keyId;
    razorpayKeySecret := keySecret;
    #ok(())
  };

  public query func getRazorpayKeyId() : async Text {
    razorpayKeyId
  };

  public shared(_msg) func createRazorpayOrder(amountInPaise : Nat, receiptId : Text) : async Result.Result<Text, Text> {
    let body = "amount=" # Nat.toText(amountInPaise) # "&currency=INR&receipt=" # receiptId;
    let credentials = razorpayKeyId # ":" # razorpayKeySecret;
    let encodedCreds = encodeBase64(credentials);
    let response = await HttpOutcalls.post(
      "https://api.razorpay.com/v1/orders",
      body,
      [("Authorization", "Basic " # encodedCreds), ("Content-Type", "application/x-www-form-urlencoded")]
    );
    switch (response) {
      case (#ok(data)) { #ok(data) };
      case (#err(e)) { #err("Razorpay API error: " # e) };
    }
  };

  func encodeBase64(input : Text) : Text {
    // Simple placeholder — in production use proper base64
    input
  };

  // ─── Custom Creations ─────────────────────────────────────────────────────

  public shared(_msg) func submitCustomRequest(request : { customerName : Text; email : Text; phone : Text; description : Text; preferredCategory : Text; budgetRange : Text; fileId : Text }) : async Result.Result<Nat, Text> {
    let id = nextRequestId;
    nextRequestId += 1;
    customRequests.put(id, {
      id;
      customerName = request.customerName;
      email = request.email;
      phone = request.phone;
      description = request.description;
      preferredCategory = request.preferredCategory;
      budgetRange = request.budgetRange;
      fileId = request.fileId;
      status = "new";
      submittedAt = Time.now();
    });
    #ok(id)
  };

  public shared(msg) func getCustomRequests() : async Result.Result<[CustomRequest], Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    #ok(Iter.toArray(customRequests.vals()))
  };

  public shared(msg) func updateCustomRequestStatus(id : Nat, status : Text) : async Result.Result<(), Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    switch (customRequests.get(id)) {
      case null { #err("Request not found") };
      case (?req) {
        customRequests.put(id, { req with status });
        #ok(())
      };
    }
  };

  // ─── Contact ──────────────────────────────────────────────────────────────

  public shared(_msg) func submitContact(name : Text, email : Text, phone : Text, message : Text) : async Result.Result<Nat, Text> {
    let id = nextContactId;
    nextContactId += 1;
    contacts.put(id, { id; name; email; phone; message; submittedAt = Time.now() });
    #ok(id)
  };

  public shared(msg) func getContacts() : async Result.Result<[ContactSubmission], Text> {
    if (not (await Authorization.isAdmin(msg.caller))) {
      return #err("Unauthorized");
    };
    #ok(Iter.toArray(contacts.vals()))
  };

  // ─── Categories ───────────────────────────────────────────────────────────

  public query func getCategories() : async [Text] {
    ["Centre Tables", "Coffee Tables", "Teapoys", "Sofa Siders", "TV Unit Bottoms", "Bar Tables", "Garden Sets", "Designer Shoe Racks"]
  };

  // ─── Admin ────────────────────────────────────────────────────────────────

  public shared(msg) func isAdmin() : async Bool {
    await Authorization.isAdmin(msg.caller)
  };

};
