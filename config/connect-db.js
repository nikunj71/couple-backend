import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
console.log('process.env.MONGO_URL', process.env.MONGO_URL);
(async function () {
  try {
    await mongoose.connect('mongodb://localhost:27017/rating', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // await mongoose.connect("mongodb://localhost:27017/joypabe", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    console.log('DB connection successfully');
    // syncDoctorsToProviders();
  } catch (error) {
    console.log('Could not connect to the database. Exiting now...', error);
    process.exit();
  }
})();
