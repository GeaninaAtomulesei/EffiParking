package com.res.efp.service.impl;

import cloud.artik.api.MessagesApi;
import cloud.artik.client.ApiClient;
import cloud.artik.client.ApiException;
import cloud.artik.client.Configuration;
import cloud.artik.client.auth.OAuth;
import cloud.artik.model.NormalizedMessage;
import cloud.artik.model.NormalizedMessagesEnvelope;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ArtikCloudService {

    @Value("${artik.device.id}")
    private String deviceId;

    @Value("${artik.device.token}")
    private String deviceToken;

    @Value("${artik.oauth}")
    private String artikOauth;

    public Map<Integer, Integer> getData(String parkingName, int totalLots) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setDebugging(true);

        OAuth oAuth = (OAuth) defaultClient.getAuthentication(this.artikOauth);
        oAuth.setAccessToken(this.deviceToken);
        MessagesApi messageApiInstance = new MessagesApi();
        try {
            NormalizedMessagesEnvelope envelope = messageApiInstance.getLastNormalizedMessages(1, this.deviceId, null);
            List<NormalizedMessage> messages = envelope.getData();
            for(NormalizedMessage message : messages) {
                if(message.getData().get(parkingName) != null) {
                    Double value = (Double) message.getData().get(parkingName);
                    return convertToBinary((int) value.doubleValue(), totalLots);
                }
            }
        } catch (ApiException e) {
            System.err.println("Exception when calling MessagesApi#getLastNormalizedMessages");
            e.printStackTrace();
        }
        return null;
    }

    public Map<Integer, Integer> convertToBinary(int value, int totalLots) {
        Map<Integer, Integer> valueMap = new HashMap<>();
        String stringValue = StringUtils.leftPad(Integer.toBinaryString(value), totalLots, '0');
        int length = stringValue.length();
        for(int i = 0; i < length; i++) {
            valueMap.put(i, Integer.valueOf(stringValue.substring(stringValue.length() - 1, stringValue.length())));
            stringValue = stringValue.substring(0, stringValue.length() - 1);
        }
        return valueMap;
    }
}
