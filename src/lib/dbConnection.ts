import mongoose from "mongoose";

type connectionObject = {
  isConnected?: Number;
};

const connection: connectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("databse is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.APP_NAME}` || ""
    );
    // console.log(db);

    connection.isConnected = db.connections[0].readyState;
    // console.log(db.connections[0].readyState);
    console.log("database is connected successFully");
  } catch (error) {
    console.log("database connection failed!! ", error);
    process.exit(1);
  }
}

export default dbConnection;
