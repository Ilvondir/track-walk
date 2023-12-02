import {Activity} from "./Activity";

export class Marker {
    constructor(
        public id = 0,
        public position = 0,
        public longtitude = 0.0,
        public latitude = 0.0,
        public activity = new Activity()
    ) {
    }
}