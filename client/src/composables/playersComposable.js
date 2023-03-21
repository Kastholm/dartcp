/* -------------------------------------------------------------------------- */
/*                          Connection to the server                          */
/* -------------------------------------------------------------------------- */
// Connects to the server and sends the data from the form to the server
import axios from "axios";
const url = "http://localhost:3000/players";

// Checking post count for development purposes
axios
  .get("http://localhost:3000/players")
  .then((response) => {
    console.log(`There are ${response.data.length} players in the database`);
  })
  .catch((error) => {
    console.error(error);
  });

/* -------------------------------------------------------------------------- */
/*                        Collecting data from the form                       */
/* -------------------------------------------------------------------------- */
// Collects the data from the form and sends it to the server
class playerService {
  // Function to get all quizzes from the server
  static getPlayers() {
    // returning a promise so that the data can be used in other files
    return new Promise(async (resolve, reject) => {
      // try catch block to catch any errors
      try {
        const res = await axios.get(url);
        const data = res.data;
        resolve(
          data.map((player) => ({
            ...player,
            createdAt: new Date(player.createdAt),
          }))
        );
        // If promise is rejected, return the error
      } catch (err) {
        reject(err);
        return [];
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/*            Exporting the class so it can be used in other files            */
/* -------------------------------------------------------------------------- */
export default playerService;
