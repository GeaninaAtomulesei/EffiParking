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
            Lot lot = new Lot();
            lotRepository.save(lot);
            lot.setNumber(i + 1);
            lot.setParking(parking);
            lot.setVacant(true);
            lot.setReserved(false);
            lotRepository.save(lot);
            addedLots.add(lot);
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

    private void setLots(int lastLotNumber, int numberOfLots) {

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
}
