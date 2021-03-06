package com.res.efp.service.impl;

import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Parking;
import com.res.efp.domain.model.Reservation;
import com.res.efp.domain.repository.LotRepository;
import com.res.efp.domain.repository.ParkingRepository;
import com.res.efp.service.LotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Service
@Transactional
public class LotServiceImpl implements LotService {

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private ParkingRepository parkingRepository;

    @Override
    public Lot findLot(Long lotId) {
        return lotRepository.findOne(lotId);
    }

    @Override
    public void removeFromParking(Parking parking, int numberOfLots) {
        List<Lot> currentLots = parking.getLots();
        int initialLots = currentLots.size();

        List<Integer> lotNumbers = new ArrayList<>();
        for(Lot lot : currentLots) {
            lotNumbers.add(lot.getNumber());
        }
        int lastNumber;

        if((lotNumbers.isEmpty()) || (lotNumbers.size() == 0) || (lotNumbers == null)) {
            lastNumber = 0;
        } else {
            lastNumber = Collections.max(lotNumbers);
        }

        for(int i = lastNumber; i > lastNumber - numberOfLots; i--) {
            Lot lot = lotRepository.findByNumber(i);
            currentLots.remove(lot);
            lotRepository.delete(lot);
        }

        parking.setLots(currentLots);
        parking.setTotalLots(initialLots - numberOfLots);
        parking.setAvailableLots(initialLots - numberOfLots);
        parkingRepository.save(parking);
    }

    @Override
    public List<Lot> addToParking(Parking parking, int numberOfLots) {
        List<Lot> existingLots = parking.getLots();
        List<Integer> lotNumbers = new ArrayList<>();
        for(Lot lot : existingLots) {
            lotNumbers.add(lot.getNumber());
        }
        int lastLotNumber;

        if((lotNumbers == null) || (lotNumbers.isEmpty()) || (lotNumbers.size() == 0)) {
            lastLotNumber = 0;
        } else {
            lastLotNumber = Collections.max(lotNumbers);
        }

        List<Lot> addedLots = new ArrayList<>();
        for(int i = lastLotNumber; i < numberOfLots + lastLotNumber; i++) {
            Lot addedLot = new Lot();
            lotRepository.save(addedLot);
            addedLot.setNumber(i + 1);
            addedLot.setParking(parking);
            addedLot.setVacant(true);
            addedLot.setReserved(false);
            lotRepository.save(addedLot);
            addedLots.add(addedLot);
        }

        parking.getLots().addAll(addedLots);

        if((parking.getTotalLots() == null) || (parking.getTotalLots() == 0)){
            parking.setTotalLots(numberOfLots);
        } else {
            parking.setTotalLots(parking.getTotalLots() + numberOfLots);
        }

        if((parking.getAvailableLots() == null) || (parking.getAvailableLots() == 0)){
            parking.setAvailableLots(numberOfLots);
        } else {
            parking.setAvailableLots(parking.getAvailableLots() + numberOfLots);
        }

        parkingRepository.save(parking);
        return addedLots;
    }

    @Override
    public List<Lot> findByParkingId(Long parkingId) {
        return lotRepository.findByParkingId(parkingId);
    }

    @Override
    public Lot setOccupied(Lot lot) {
        lot.setVacant(false);
        return lotRepository.save(lot);
    }

    @Override
    public Lot setVacant(Lot lot) {
        lot.setVacant(true);
        return lotRepository.save(lot);
    }

    @Override
    public List<Lot> getAvailable(Parking parking) {
        List<Lot> totalLots = lotRepository.findByParkingId(parking.getId());
        List<Lot> availableLots = new ArrayList<>();

        for(Lot lot : totalLots) {
            if(!lot.isReserved()) {
                availableLots.add(lot);
            }
        }

        if((availableLots == null) || (availableLots.isEmpty())) {
            return null;
        }

        return availableLots;
    }

    @Override
    public List<Lot> getAvailableToday(Parking parking) {
        List<Lot> totalLots = lotRepository.findByParkingId(parking.getId());
        List<Lot> availableToday = new ArrayList<>();

        for(Lot lot: totalLots) {
            if(lot.isReserved()) {
                List<Reservation> reservations = lot.getReservations();
                for(Reservation reservation : reservations) {
                    if(reservation.getStartDate().getDayOfYear() != LocalDateTime.now().getDayOfYear()) {
                        availableToday.add(lot);
                    }
                }
            }
        }
        if((availableToday == null) || (availableToday.isEmpty())) {
            return null;
        }
        return availableToday;
    }

    @Override
    public Lot findByParkingAndNumber(Long parkingId, int number) {
        return lotRepository.findByNumberAndParking(parkingId, number);
    }

    @Override
    public Integer getAvailableForSpecificPeriod(Long parkingId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Lot> lots = lotRepository.findByParkingId(parkingId);
        List<Lot> availableLots = new ArrayList<>();

        for(Lot lot : lots) {
            List<Reservation> reservations = lot.getReservations();
            if(reservations == null || reservations.isEmpty()) {
                availableLots.add(lot);
            } else {
                List<Reservation> overlappingReservations = new ArrayList<>();
                for(Reservation reservation : reservations) {
                    if(isOverlapping(reservation.getStartDate(), reservation.getEndDate(), startDate, endDate)) {
                        overlappingReservations.add(reservation);
                    }
                }
                if(overlappingReservations.isEmpty()) {
                    availableLots.add(lot);
                }
            }
        }
        return availableLots.size();
    }

    private static boolean isOverlapping(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2, LocalDateTime end2) {
        return !start1.isAfter(end2) && !start2.isAfter(end1);
    }
}
