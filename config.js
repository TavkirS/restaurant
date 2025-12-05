// Restaurant Configuration - Edit these values as needed
const CONFIG = {
  // Restaurant Information
  restaurantName: "Bella Vista Restaurant",
  restaurantTagline: "Authentic Italian Cuisine",
  phone: "+91-9876543210",
  email: "orders@bellavista.com",
  address: "123 Food Street, Gourmet City, GC 12345",

  // Pricing Configuration
  gstPercentage: 5, // GST percentage (5% for restaurants in India)
  deliveryFee: 50, // Delivery fee in rupees

  // Social Media Links
  whatsappNumber: "919876543210", // Without + or 0 prefix
  instagram: "https://instagram.com/bellavista",
  facebook: "https://facebook.com/bellavista",

  // Business Hours
  businessHours: {
    monday: "11:00 AM - 10:00 PM",
    tuesday: "11:00 AM - 10:00 PM",
    wednesday: "11:00 AM - 10:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "11:00 AM - 11:00 PM",
    sunday: "12:00 PM - 9:00 PM"
  },

  // Delivery Options
  deliveryRadius: 5, // Delivery radius in kilometers
  minimumOrder: 200, // Minimum order amount for delivery

  // Technical Settings
  currency: "₹",
  currencyName: "INR"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
