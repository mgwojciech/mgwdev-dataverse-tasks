import {vi, expect } from "vitest";
import { TimeZoneService } from "../../src/services/TimeZoneService";

describe("TimeZoneService", ()=>{
    test("should return relative time (seconds)", ()=>{
        let date = new Date();
        date.setSeconds(date.getSeconds() - 10);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("10 seconds ago");

        date = new Date();
        date.setSeconds(date.getSeconds() + 10);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 10 seconds");
    });
    test("should return relative time (minutes)", ()=>{
        let date = new Date();
        date.setMinutes(date.getMinutes() - 10);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("10 minutes ago");

        date = new Date();
        date.setMinutes(date.getMinutes() + 10);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 10 minutes");
    });
    test("should return relative time (hours)", ()=>{
        let date = new Date();
        date.setHours(date.getHours() - 10);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("10 hours ago");

        date = new Date();
        date.setHours(date.getHours() + 10);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 10 hours");
    });
    test("should return relative time (days)", ()=>{
        let date = new Date();
        date.setDate(date.getDate() - 2);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("2 days ago");

        date = new Date();
        date.setDate(date.getDate() + 2);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 2 days");
    });
    test("should return relative time (weeks)", ()=>{
        let date = new Date();
        date.setDate(date.getDate() - 15);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("2 weeks ago");

        date = new Date();
        date.setDate(date.getDate() + 15);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 2 weeks");
    });
    test("should return relative time (months)", ()=>{
        let date = new Date();
        date.setMonth(date.getMonth() - 2);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("2 months ago");

        date = new Date();
        date.setMonth(date.getMonth() + 2);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 2 months");
    });
    test("should return relative time (years)", ()=>{
        let date = new Date();
        date.setFullYear(date.getFullYear() - 2);
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("2 years ago");

        date = new Date();
        date.setFullYear(date.getFullYear() + 2);
        const relativeTimeFuture = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTimeFuture).toBe("in 2 years");
    });
    test("should return relative time (now)", ()=>{
        const date = new Date();
        const language = "en-US";
        const relativeTime = TimeZoneService.getRelativeTime(date, language);
        expect(relativeTime).toBe("now");
    });
});