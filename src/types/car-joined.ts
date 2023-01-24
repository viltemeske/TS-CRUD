import Brand from "./brand";
import Model from "./model";
import Car from "./car";

type CarJoined = {
    brand: Brand['title'],
    model: Model['title'],
};

export default CarJoined;
