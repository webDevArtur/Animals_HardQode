import { requestAnimals, requestAnimalsWithError } from "./api";
import Requirements from "./Requirements";

requestAnimals({ animal: "", amount: "", limit: 4, offset: 0 }).then(
    console.log
);
requestAnimalsWithError({ animal: "", amount: "", limit: 4, offset: 0 }).catch(
    console.error
);

const App = () => {
    return <Requirements />;
}

export default App;
