const navbarNavigations = [

  {
    title: "Track My Orders", url: "/track", badge: "",
    requiresAuth: false,
    requiresNoAuth: false,
    requiresRole: ''
  },
  {
    title: "Our Policy", url: "/faq", badge: "",
    requiresAuth: false,
    requiresNoAuth: false,
    requiresRole: ''
  },
  {
    title: "Shop", url: "/shop", badge: "",
    requiresAuth: false,
    requiresNoAuth: false,
    requiresRole: ''
  },
  {
    title: "Vendors", url: "/shops", badge: "",
    requiresAuth: false,
    requiresNoAuth: false,
    requiresRole: ''
  },
  {
    title: "Dashboard", url: "/vendor/dashboard", badge: "",
    // child: [],
    requiresAuth: true,
    requiresNoAuth: false,
    requiresRole: 'Vendor'
  },
  {
    title: "Profile", url: "/profile", badge: "",
    // child: [],
    requiresAuth: true,
    requiresNoAuth: false,
    requiresRole: 'Customer'
  },

];

export default navbarNavigations;
