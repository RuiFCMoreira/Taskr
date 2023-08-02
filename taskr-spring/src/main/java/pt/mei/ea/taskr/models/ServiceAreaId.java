package pt.mei.ea.taskr.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ServiceAreaId implements Serializable {
    private Long districtId;

    @Column(nullable = true)
    private Long municipalityId;

    private Long providerId;

    public ServiceAreaId(Long districtId, Long municipalityId, Long providerId) {
        this.districtId = districtId;
        this.municipalityId = municipalityId;
        this.providerId = providerId;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public Long getMunicipalityId() {
        return municipalityId;
    }

    public void setMunicipalityId(Long municipalityId) {
        this.municipalityId = municipalityId;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public ServiceAreaId() {

    }
}
