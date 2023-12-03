import {Activity} from "../models/Activity";

export const reformatDate = (date: string) => {

    // 2019-01-01T00:00:00.000Z
    let newDate = date.slice(6, 10);
    newDate += "-";
    newDate += date.slice(0, 2);
    newDate += "-";
    newDate += date.slice(3, 5);
    newDate += "T";
    newDate += date.slice(12, 20);

    return newDate;
}

export const timeBetween = (time: number) => {

    const hours = Math.floor(time / 3600000); // Obliczanie godzin
    const minutes = Math.floor((time % 3600000) / 60000); // Obliczanie minut
    const seconds = Math.floor((time % 60000) / 1000); // Obliczanie sekund

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const speed = (a: Activity) => {

    const time = Number(Date.parse(reformatDate(a.end)) - Date.parse(reformatDate(a.start)));
    const distance = Number(a.distance);

    return (distance / time) * (3600000 / 1000);
}