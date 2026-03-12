import AccessControl "./authorization/access-control";
import MixinAuth "./authorization/MixinAuthorization";
import BlobMixin "./blob-storage/Mixin";
import Outcall "./http-outcalls/outcall";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Option "mo:core/Option";

actor MaisonArbor {

  let accessControlState = AccessControl.initState();
  include MixinAuth(accessControlState);
  include BlobMixin();

  // ─── Types ───────────────────────────────────────────────────────────────

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    material : Text;
    price : Nat;
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
    status : Text;
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
    status : Text;
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

  var nextOrderId : Nat = 1;
  var nextRequestId : Nat = 1;
  var nextContactId : Nat = 1;
  var razorpayKeyId : Text = "rzp_test_placeholder";
  var razorpayKeySecret : Text = "placeholder_secret";

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let customRequests = Map.empty<Nat, CustomRequest>();
  let contacts = Map.empty<Nat, ContactSubmission>();
  let carts = Map.empty<Text, [CartItem]>();

  // ─── Seed Data ──────────────────────────────────────────────────────────

  func sp(id : Nat, name : Text, cat : Text, mat : Text, price : Nat, desc : Text, img : Text, inStock : Bool, featured : Bool) {
    products.add(id, { id; name; category = cat; material = mat; price; description = desc; imageUrl = img; inStock; featured });
  };

  do {
    sp(1,  "The Arbor Centre Table",   "Centre Tables",       "Solid Sheesham Wood",          8500000,  "A statement centrepiece rooted in natural form. Handcrafted from solid Sheesham with a smooth matte finish.",            "/assets/generated/prod-arbor-centre.dim_900x900.jpg",  true,  true);
    sp(2,  "The Forma Centre Table",   "Centre Tables",       "Solid Walnut & Steel",         12500000, "Clean architectural lines meet industrial precision. Walnut top with brushed steel hairpin legs.",                       "/assets/generated/cat-centre-tables.dim_800x1000.jpg", true,  false);
    sp(3,  "The Terra Centre Table",   "Centre Tables",       "Mango Wood & Ceramic",         6800000,  "Earthy and grounding. A ceramic slab top rests on a live-edge mango wood base.",                                       "/assets/generated/cat-centre-tables.dim_800x1000.jpg", true,  false);
    sp(4,  "The Volta Coffee Table",   "Coffee Tables",       "Solid Walnut",                 4800000,  "Low-slung and confident. The Volta is crafted from a single slab of solid walnut with handturned legs.",               "/assets/generated/prod-volta-coffee.dim_900x900.jpg",  true,  true);
    sp(5,  "The Slate Coffee Table",   "Coffee Tables",       "Teak & Cane",                  3600000,  "Rattan cane shelf below, solid teak surface above. A refined take on tropical modernism.",                             "/assets/generated/cat-coffee-tables.dim_800x1000.jpg", true,  false);
    sp(6,  "The Arch Coffee Table",    "Coffee Tables",       "Solid Oak",                    5500000,  "Two arched legs supporting a generous oak tabletop. Structural poetry in solid wood.",                                 "/assets/generated/cat-coffee-tables.dim_800x1000.jpg", false, false);
    sp(7,  "The Rove Teapoy",          "Teapoys",             "Solid Teak with Brass Wheels", 2200000,  "A bedside companion that moves with you. Solid teak with four premium brass-capped wheels.",                           "/assets/generated/cat-teapoys.dim_800x1000.jpg",       true,  true);
    sp(8,  "The Drift Teapoy",         "Teapoys",             "Mango Wood & Black Steel",     1800000,  "Mango wood rounds seated on a minimal black steel frame with smooth rolling castors.",                                 "/assets/generated/cat-teapoys.dim_800x1000.jpg",       true,  false);
    sp(9,  "The Poise Sofa Sider",     "Sofa Siders",         "Solid Walnut",                 1500000,  "Slim, precise and purposeful. A walnut C-table that slides neatly beside any sofa.",                                   "/assets/generated/cat-sofa-siders.dim_800x1000.jpg",   true,  true);
    sp(10, "The Lean Sofa Sider",      "Sofa Siders",         "Solid Sheesham & Cane",        1200000,  "A slender profile with a woven cane shelf. Complements both modern and traditional interiors.",                         "/assets/generated/cat-sofa-siders.dim_800x1000.jpg",   true,  false);
    sp(11, "The Base TV Unit",         "TV Unit Bottoms",     "Solid Walnut & Veneer",        9800000,  "Low, wide and deeply considered. Hidden cable management and soft-close drawers in solid walnut.",                     "/assets/generated/cat-tv-units.dim_800x1000.jpg",      true,  true);
    sp(12, "The Plinth TV Unit",       "TV Unit Bottoms",     "Solid Sheesham",               7500000,  "A single elongated form with open shelving and a warm Sheesham finish.",                                               "/assets/generated/cat-tv-units.dim_800x1000.jpg",      true,  false);
    sp(13, "The Alto Bar Table",       "Bar Tables",          "Solid Oak & Brass",            6200000,  "Counter-height oak top with slender brass-tipped legs. Elevates any home bar setting.",                                "/assets/generated/cat-bar-tables.dim_800x1000.jpg",    true,  true);
    sp(14, "The Perch Bar Table",      "Bar Tables",          "Solid Walnut",                 5400000,  "A clean walnut top on four tapered legs. Effortlessly transitions from breakfast counter to evening bar.",              "/assets/generated/cat-bar-tables.dim_800x1000.jpg",    true,  false);
    sp(15, "The Grove Garden Set",     "Garden Sets",         "FSC-Certified Teak",           18500000, "Four chairs and a generous table in sustainably sourced teak. Weathers beautifully over time.",                        "/assets/generated/cat-garden-sets.dim_800x1000.jpg",   true,  true);
    sp(16, "The Patio Bistro Set",     "Garden Sets",         "Solid Acacia",                 12000000, "A two-seat bistro table and chair set in solid acacia. Perfect for a private garden corner.",                          "/assets/generated/cat-garden-sets.dim_800x1000.jpg",   true,  false);
    sp(17, "The Threshold Shoe Rack",  "Designer Shoe Racks", "Solid Walnut & Steel",         3200000,  "Open shelves in solid walnut on a minimal steel frame. A sculptural entrance statement.",                             "/assets/generated/cat-shoe-racks.dim_800x1000.jpg",    true,  true);
    sp(18, "The Foyer Shoe Cabinet",   "Designer Shoe Racks", "Solid Sheesham",               4500000,  "A closed cabinet with a fluted door panel. Stores up to 18 pairs with discreet elegance.",                           "/assets/generated/cat-shoe-racks.dim_800x1000.jpg",    true,  false);
  };

  // ─── Products ─────────────────────────────────────────────────────────────

  public query func getProducts() : async [Product] {
    products.values().toArray()
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(pr : Product) : Bool = pr.category == category)
  };

  public query func getProductById(id : Nat) : async ?Product {
    products.get(id)
  };

  public query func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(pr : Product) : Bool = pr.featured)
  };

  public query func getCategories() : async [Text] {
    ["Centre Tables", "Coffee Tables", "Teapoys", "Sofa Siders", "TV Unit Bottoms", "Bar Tables", "Garden Sets", "Designer Shoe Racks"]
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────

  public shared(msg) func addToCart(productId : Nat, quantity : Nat) : async { #ok; #err : Text } {
    let key = msg.caller.toText();
    switch (products.get(productId)) {
      case null { #err("Product not found") };
      case (?_) {
        let current = carts.get(key).get([]);
        let updated = switch (current.find(func(i : CartItem) : Bool = i.productId == productId)) {
          case (?_) {
            current.map(func(i : CartItem) : CartItem =
              if (i.productId == productId) { { productId = i.productId; quantity = i.quantity + quantity } } else { i }
            )
          };
          case null { current.concat([{ productId; quantity }]) };
        };
        carts.add(key, updated);
        #ok
      };
    }
  };

  public shared(msg) func removeFromCart(productId : Nat) : async () {
    let key = msg.caller.toText();
    carts.add(key, carts.get(key).get([]).filter(func(i : CartItem) : Bool = i.productId != productId));
  };

  public shared(msg) func updateCartQuantity(productId : Nat, quantity : Nat) : async () {
    let key = msg.caller.toText();
    let current = carts.get(key).get([]);
    let updated = if (quantity == 0) {
      current.filter(func(i : CartItem) : Bool = i.productId != productId)
    } else {
      current.map(func(i : CartItem) : CartItem =
        if (i.productId == productId) { { productId = i.productId; quantity } } else { i }
      )
    };
    carts.add(key, updated);
  };

  public shared(msg) func getCart() : async [CartItem] {
    carts.get(msg.caller.toText()).get([])
  };

  public shared(msg) func clearCart() : async () {
    carts.add(msg.caller.toText(), []);
  };

  // ─── Orders ───────────────────────────────────────────────────────────────

  public shared(msg) func createOrder(customerInfo : CustomerInfo, items : [CartItem], total : Nat, razorpayOrderId : Text) : async { #ok : Nat; #err : Text } {
    if (items.size() == 0) { return #err("Cart is empty") };
    let id = nextOrderId;
    nextOrderId += 1;
    orders.add(id, {
      id;
      customerId = msg.caller;
      customerInfo;
      items;
      total;
      status = "pending";
      razorpayOrderId;
      razorpayPaymentId = "";
      createdAt = Time.now();
    });
    #ok(id)
  };

  public shared(msg) func confirmPayment(orderId : Nat, razorpayPaymentId : Text) : async { #ok; #err : Text } {
    switch (orders.get(orderId)) {
      case null { #err("Order not found") };
      case (?order) {
        if (not Principal.equal(order.customerId, msg.caller) and not AccessControl.isAdmin(accessControlState, msg.caller)) {
          return #err("Unauthorized");
        };
        orders.add(orderId, { order with status = "paid"; razorpayPaymentId });
        #ok
      };
    }
  };

  public shared(msg) func getOrder(orderId : Nat) : async { #ok : Order; #err : Text } {
    switch (orders.get(orderId)) {
      case null { #err("Order not found") };
      case (?order) {
        if (not Principal.equal(order.customerId, msg.caller) and not AccessControl.isAdmin(accessControlState, msg.caller)) {
          return #err("Unauthorized");
        };
        #ok(order)
      };
    }
  };

  public shared(msg) func getAllOrders() : async { #ok : [Order]; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, msg.caller)) {
      return #err("Unauthorized");
    };
    #ok(orders.values().toArray())
  };

  public shared(msg) func updateOrderStatus(orderId : Nat, status : Text) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, msg.caller)) {
      return #err("Unauthorized");
    };
    switch (orders.get(orderId)) {
      case null { #err("Order not found") };
      case (?order) {
        orders.add(orderId, { order with status });
        #ok
      };
    }
  };

  // ─── Razorpay ───────────────────────────────────────────────────────────

  public shared(msg) func setRazorpayKeys(keyId : Text, keySecret : Text) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, msg.caller)) {
      return #err("Unauthorized");
    };
    razorpayKeyId := keyId;
    razorpayKeySecret := keySecret;
    #ok
  };

  public query func getRazorpayKeyId() : async Text {
    razorpayKeyId
  };

  public query func transformRazorpayResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    { input.response with headers = [] }
  };

  public shared func createRazorpayOrder(amountInPaise : Nat, receiptId : Text) : async { #ok : Text; #err : Text } {
    let body = "amount=" # amountInPaise.toText() # "&currency=INR&receipt=" # receiptId;
    let response = await Outcall.httpPostRequest(
      "https://api.razorpay.com/v1/orders",
      [
        { name = "Authorization"; value = "Basic " # razorpayKeyId # ":" # razorpayKeySecret },
        { name = "Content-Type"; value = "application/x-www-form-urlencoded" }
      ],
      body,
      transformRazorpayResponse
    );
    #ok(response)
  };

  // ─── Custom Creations ─────────────────────────────────────────────────────

  public shared(_msg) func submitCustomRequest(customerName : Text, email : Text, phone : Text, description : Text, preferredCategory : Text, budgetRange : Text, fileId : Text) : async { #ok : Nat; #err : Text } {
    let id = nextRequestId;
    nextRequestId += 1;
    customRequests.add(id, {
      id;
      customerName;
      email;
      phone;
      description;
      preferredCategory;
      budgetRange;
      fileId;
      status = "new";
      submittedAt = Time.now();
    });
    #ok(id)
  };

  public shared(msg) func getCustomRequests() : async { #ok : [CustomRequest]; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, msg.caller)) {
      return #err("Unauthorized");
    };
    #ok(customRequests.values().toArray())
  };

  public shared(msg) func updateCustomRequestStatus(id : Nat, status : Text) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, msg.caller)) {
      return #err("Unauthorized");
    };
    switch (customRequests.get(id)) {
      case null { #err("Request not found") };
      case (?req) {
        customRequests.add(id, { req with status });
        #ok
      };
    }
  };

  // ─── Contact ──────────────────────────────────────────────────────────────

  public shared(_msg) func submitContact(name : Text, email : Text, phone : Text, message : Text) : async { #ok : Nat; #err : Text } {
    let id = nextContactId;
    nextContactId += 1;
    contacts.add(id, { id; name; email; phone; message; submittedAt = Time.now() });
    #ok(id)
  };

  public shared(msg) func getContacts() : async { #ok : [ContactSubmission]; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, msg.caller)) {
      return #err("Unauthorized");
    };
    #ok(contacts.values().toArray())
  };

  // ─── Admin ────────────────────────────────────────────────────────────────

  public shared(msg) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, msg.caller)
  };

};
