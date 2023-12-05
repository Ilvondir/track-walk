import {Activity} from "../models/Activity";
import {Point} from "../models/Point";

export const distance = (m1: any, m2: Point) => {
    let lat1 = m1.latitude;
    let lon1 = m1.longitude
    let lat2 = m2.latitude;
    let lon2 = m2.longitude;
    const earthRadius = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (earthRadius * c) * 1000;
}

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

    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    if (hours < 0 || minutes < 0 || seconds < 0) return "00:00:00";

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const speed = (a: Activity) => {

    const time = Number(Date.parse(reformatDate(a.end)) - Date.parse(reformatDate(a.start)));
    const distance = Number(a.distance);

    if (time <= 0) return 0;

    return (distance / time) * (3600000 / 1000);
}

export const getNow = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: "Europe/Warsaw",
        hour12: false,
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        minute: "2-digit",
        hour: "2-digit",
        second: "2-digit"
    });
}