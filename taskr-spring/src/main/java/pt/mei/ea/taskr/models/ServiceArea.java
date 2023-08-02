package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class ServiceArea {



    @EmbeddedId
    private ServiceAreaId serviceAreaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("districtId")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("municipalityId")
    private Municipality municipality;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("providerId")
    private Provider provider;

    public ServiceArea() {
    }

    public ServiceArea(Provider provider, District district, Municipality municipality) {
        this.provider = provider;
        this.district = district;
        this.municipality = municipality;
        this.serviceAreaId = new ServiceAreaId(district.getId(), municipality.getId(), provider.getId());

    }

    public ServiceAreaId getServiceAreaId() {
        return serviceAreaId;
    }

    public void setServiceAreaId(ServiceAreaId serviceAreaId) {
        this.serviceAreaId = serviceAreaId;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

    public Municipality getMunicipality() {
        return municipality;
    }

    public void setMunicipality(Municipality municipality) {
        this.municipality = municipality;
    }

    public Provider getProvider() {
        return provider;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ServiceArea that = (ServiceArea) o;
        return Objects.equals(district, that.district) && Objects.equals(municipality, that.municipality) && Objects.equals(provider, that.provider);
    }

    @Override
    public int hashCode() {
        return Objects.hash(district, municipality, provider);
    }
}
