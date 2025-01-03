const { db } = require("../config/firebase");

exports.addScheduleByUid = async (req, res) => {
  try {
    const { uid, event, location, time, date, note } = req.body;

    if (!uid || !event || !location || !time || !date) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const scheduleData = {
      uid,
      event,
      location,
      time,
      date,
      note,
      createdAt: new Date().toISOString(),
    };

    const scheduleRef = await db.collection("schedule").add(scheduleData);

    res
      .status(201)
      .json({
        message: "schedule added successfully",
        scheduleID: scheduleRef.id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScheduleByUid = async (req, res) => {
  try {
      const uid = req.params.uid; // ambil uid dari parameter URL
      //cek apakah uid ada
      if (!uid) {
          return res.status(400).json({ error: "UID is required!" });
      }
      //query firestore untuk mendapatkan data schedule berdasarkan uid
      const scheduleQuery = await db.collection("schedule").where("uid", "==", uid).get();
      if (scheduleQuery.empty) {
          return res.status(404).json({ error: "No schedule found with this UID!" });
      }
      //proses data dari semua dokumen yang ditemukan
      const schedule = [];
      scheduleQuery.forEach((doc) => {
          schedule.push({ scheduleID: doc.id, ...doc.data() });
      });

      // Urutkan data berdasarkan date dan time
      schedule.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB; // Urutan dari yang paling dekat
      });

      res.status(200).json({ schedule });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.updateScheduleById = async (req, res) => {
    try {
      const { scheduleId } = req.params;
      console.log("Schedule ID received:", scheduleId); // Log ID schedule yang diterima
      const { event, location, time, date, note } = req.body; // Data yang akan diupdate
  
      // Validasi ID schedule
      if (!scheduleId) {
        return res.status(400).json({ error: "Schedule ID is required!" });
      }
  
      // Referensi dokumen berdasarkan ID
      const scheduleDocRef = db.collection("schedule").doc(scheduleId);
  
      // Cek apakah dokumen ada
      const scheduleDoc = await scheduleDocRef.get();
      if (!scheduleDoc.exists) {
        return res.status(404).json({ error: "Schedule not found!" });
      }
  
      // Data untuk diupdate
      const updatedData = {};
      if (event) updatedData.event = event;
      if (location) updatedData.location = location;
      if (time) updatedData.time = time;
      if (date) updatedData.date = date;
      if (note) updatedData.note = note;
      updatedData.updatedAt = new Date().toISOString();
  
      // Lakukan update dokumen
      await scheduleDocRef.update(updatedData);
  
      res.status(200).json({ message: "Schedule updated successfully!" });
    } catch (error) {
      console.error("Error updating schedule:", error.message);
      res.status(500).json({ error: "Failed to update schedule: " + error.message });
    }
  };
  
  exports.deleteScheduleById = async (req, res) => {
    try {
      const { scheduleId } = req.params;
  
      if (!scheduleId) {
        return res.status(400).json({ error: "Schedule ID is required!" });
      }
  
      db.collection("schedule")
        .doc(scheduleId)
        .delete()
        .then(() => {
          res.status(200).json({ message: "Schedule deleted successfully!" });
        })
        .catch((error) => {
          console.error("Error deleting schedule:", error.message);
          res.status(500).json({ error: error.message });
        });
    } catch (error) {
      console.error("Error deleting schedule:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  
  
