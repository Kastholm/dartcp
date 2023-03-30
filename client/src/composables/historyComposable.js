/* -------------------------------------------------------------------------- */
/*                          Connection to the server                          */
/* -------------------------------------------------------------------------- */
// Connects to the server and sends the data from the form to the server
import axios from "axios";
const url = "http://localhost:3000/history";

// Checking post count for development purposes
axios
  .get("http://localhost:3000/history")
  .then((response) => {
    console.log(`There are ${response.data.length} GameLogs in the database`);
  })
  .catch((error) => {
    console.error(error);
  });

/* -------------------------------------------------------------------------- */
/*                        Collecting data from the form                       */
/* -------------------------------------------------------------------------- */
// Collects the data from the form and sends it to the server
class historyService {
  static async getHistory() {
    try {
      const res = await axios.get(url);
      const data = res.data;
      return data.map((game) => ({
        ...game,
        gameDate: new Date(game.gameDate),
      }));
    } catch (err) {
      console.error(err);
      gameLogsBody;
      return [];
    }
  }

  static async addHistory(gameData) {
    try {
      await axios.post(url, gameData);
      await this.getHistory();
    } catch (err) {
      console.error(err);
    }
  }
}
/* -------------------------------------------------------------------------- */
/*            Exporting the class so it can be used in other files            */
/* -------------------------------------------------------------------------- */
export default historyService;
