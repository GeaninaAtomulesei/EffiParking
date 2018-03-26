package com.res.efp.service;

import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Parking;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
public interface LotService {
    Lot findLot(Long lotId);
    void removeFromParking(Parking parking, int numberOfLots);
    List<Lot> addToParking(Parking parking, int numberOfLots);
    List<Lot> findByParkingId(Long parkingId);
    Lot setOccupied(Lot lot);
    Lot setVacant(Lot lot);
    List<Lot> getAvailable(Parking parking);
    List<Lot> getAvailableToday(Parking parking);
    Lot findByParkingAndNumber(Long parkingId, int number);
    Integer getAvailableForSpecificPeriod(Long parkingId, LocalDateTime startDate, LocalDateTime endDate);
}
