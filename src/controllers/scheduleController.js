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
      checked: false,
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

    if (!uid) {
      return res.status(400).json({ error: "UID is required!" });
    }

    // Mendapatkan tanggal saat ini dan mengurangi 3 hari
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set waktu ke awal hari untuk perbandingan

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(currentDate.getDate() - 3); // Mengurangi 3 hari dari tanggal saat ini
    threeDaysAgo.setHours(0, 0, 0, 0); // Set waktu ke awal hari untuk perbandingan

    // Query Firestore untuk mendapatkan data schedule berdasarkan uid
    const scheduleQuery = await db.collection("schedule").where("uid", "==", uid).get();
    if (scheduleQuery.empty) {
      return res.status(200).json({ message: "Silahkan Menambahkan Schedule" });
    }

    const schedule = [];
    scheduleQuery.forEach((doc) => {
      const scheduleData = doc.data();
      const scheduleDate = new Date(`${scheduleData.date}T${scheduleData.time}`);
      
      // Periksa apakah jadwal sudah lewat 3 hari atau tidak
      if (scheduleDate >= threeDaysAgo) {
        schedule.push({ scheduleID: doc.id, ...scheduleData });
      }
    });

    if (schedule.length === 0) {
      return res.status(200).json({ message: "Tidak ada jadwal dalam 3 hari terakhir." });
    }

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
    const { event, location, time, date, note, checked } = req.body;

    console.log("Received scheduleId:", scheduleId);  // Debugging log
    console.log("Received body:", req.body);  // Debugging log

    if (!scheduleId) {
      return res.status(400).json({ error: "Schedule ID is required!" });
    }

    const scheduleDocRef = db.collection('schedule').doc(scheduleId);
    const scheduleDoc = await scheduleDocRef.get();

    if (!scheduleDoc.exists) {
      return res.status(404).json({ error: "Schedule not found!" });
    }

    const updatedData = {};
    if (event) updatedData.event = event;
    if (location) updatedData.location = location;
    if (time) updatedData.time = time;
    if (date) updatedData.date = date;
    if (note) updatedData.note = note;
    if (checked !== undefined) updatedData.checked = checked;
    updatedData.updatedAt = new Date().toISOString();

    await scheduleDocRef.update(updatedData);

    res.status(200).json({ message: "Schedule updated successfully!" });
  } catch (error) {
    console.error("Error updating schedule:", error);  // Log the error
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
  
  
