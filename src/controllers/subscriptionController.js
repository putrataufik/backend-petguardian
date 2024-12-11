const snap = require("../config/midtrans");

const { db} = require("../config/firebase");

const createTransaction = async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, email } = req.body;
    if (!first_name || !email) {
      return res.status(400).json({ message: "Name and email are required"+ first_name + " and " + email});
    }

    // Membuat detail transaksi
    const transactionDetails = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: 35000,
      },
      customer_details: {
        first_name: first_name,
        email: email,
      },
    };

    // Membuat transaksi di Midtrans Snap
    const transaction = await snap.createTransaction(transactionDetails);

    console.log("Transaction response:", transaction);

    // Menyimpan transactionDetails dan customer_details ke Firestore
    const subscriptionData = {
      orderId: transactionDetails.transaction_details.order_id,
      grossAmount: transactionDetails.transaction_details.gross_amount,
      status: 'pending', // Status awal sebelum settlement
      paymentToken: transaction.token, // Token transaksi Midtrans
      paymentUrl: transaction.redirect_url, // URL pembayaran
      customerName: transactionDetails.customer_details.first_name,
      customerEmail: transactionDetails.customer_details.email,
      createdAt: new Date().toISOString(),
    };

    await db.collection('subscriptions').add(subscriptionData);
    console.log("Transaction and customer details saved to Firestore");

    // Mengembalikan token untuk pembayaran ke klien
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// const saveTransactionToFirestore = async (req, res) => {
//   try {
//     const { orderId, name, email, transactionStatus, grossAmount } = req.body;

//     if (!orderId || !name || !email || !transactionStatus || !grossAmount) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     console.log('Received transaction data:', req.body);
//     console.log('Transaction Status:', transactionStatus);

//     subscriptionData = {
//       orderId,
//       name,
//       email,
//       subscriptionDate: new Date(), // Menambahkan tanggal langganan saat ini
//       status: 'active',
//       grossAmount,
//     }
//     if (transactionStatus === 'settlement') {
//       await db.collection('subscriptions').add(subscriptionData);
//       res.status(200).json({ message: 'Transaction data saved successfully' });
//     }
//     else if (transactionStatus === 'pending') {
//       await db.collection('subscriptions').add(subscriptionData);
//       res.status(200).json({ message: 'Transaction data saved successfully' });
//     }
//   } catch (error) {
//     console.error("Error saving transaction:", error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
const handleNotification = async (req, res) => {
  try {
    const notification = req.body;

    console.log("Notification received:", notification);

    // Mendapatkan tanggal langganan
    const subscriptionDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month expiry
    const formattedExpiryDate = expiryDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

    // Cari dokumen berdasarkan orderId
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef.where("orderId", "==", notification.order_id).get();

    if (snapshot.empty) {
      // Jika tidak ditemukan, tambahkan data baru
      await subscriptionsRef.add({
        orderId: notification.order_id,
        transactionId: notification.transaction_id,
        paymentType: notification.payment_type,
        grossAmount: notification.gross_amount,
        status: notification.transaction_status === "settlement" ? "active" : "pending",
        subscriptionDate: notification.transaction_status === "settlement" ? subscriptionDate : null,
        expiryDate: notification.transaction_status === "settlement" ? formattedExpiryDate : null,
        customerName: notification.customer_details?.first_name || "Unknown",
        customerEmail: notification.customer_details?.email || "Unknown",
      });
      console.log("New transaction added to Firestore");
    } else {
      // Jika ditemukan, perbarui dokumen yang ada
      snapshot.forEach(async (doc) => {
        await doc.ref.update({
          transactionId: notification.transaction_id,
          paymentType: notification.payment_type,
          grossAmount: notification.gross_amount,
          status: notification.transaction_status === "settlement" ? "active" : "pending",
          subscriptionDate: notification.transaction_status === "settlement" ? subscriptionDate : null,
          expiryDate: notification.transaction_status === "settlement" ? formattedExpiryDate : null,
        });
        console.log(`Transaction with orderId ${notification.order_id} updated in Firestore`);
      });
    }

    res.status(200).json({ message: "Notification handled successfully" });
  } catch (error) {
    console.error("Error handling notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







module.exports = { createTransaction , handleNotification};
