package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.AvailabilityInterval;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record AvailabilityIntervalDTO (
    DayOfWeek day,
    LocalTime startTime,
    LocalTime endTime
){

    public static AvailabilityIntervalDTO getDTO(AvailabilityInterval availabilityInterval){
        return new AvailabilityIntervalDTO(
                availabilityInterval.getDay(),
                availabilityInterval.getStartTime(),
                availabilityInterval.getEndTime()
        );
    }
}
