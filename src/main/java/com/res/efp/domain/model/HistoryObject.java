package com.res.efp.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Created by gatomulesei on 3/14/2018.
 */
public class HistoryObject implements Serializable {

    private Long parkingAreaId;
    private String parkingAreaName;
    private String parkingAreaLocation;
    private String parkingAreaCity;

    @JsonSerialize(using = ToStringSerializer.class)
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate date;

    public Long getParkingAreaId() {
        return parkingAreaId;
    }

    public void setParkingAreaId(Long parkingAreaId) {
        this.parkingAreaId = parkingAreaId;
    }

    public String getParkingAreaName() {
        return parkingAreaName;
    }

    public void setParkingAreaName(String parkingAreaName) {
        this.parkingAreaName = parkingAreaName;
    }

    public String getParkingAreaLocation() {
        return parkingAreaLocation;
    }

    public void setParkingAreaLocation(String parkingAreaLocation) {
        this.parkingAreaLocation = parkingAreaLocation;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getParkingAreaCity() {
        return parkingAreaCity;
    }

    public void setParkingAreaCity(String parkingAreaCity) {
        this.parkingAreaCity = parkingAreaCity;
    }
}
