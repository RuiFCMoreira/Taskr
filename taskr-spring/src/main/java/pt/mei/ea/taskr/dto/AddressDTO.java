package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Address;

public record AddressDTO(
        Long id,
        String street,
        String parish,
        String municipality,
        String district
){
    public static AddressDTO getDTO(Address address){
        return new AddressDTO(address.getId(),address.getStreet(),address.getParish(),address.getMunicipality(),address.getDistrict());
    }
}