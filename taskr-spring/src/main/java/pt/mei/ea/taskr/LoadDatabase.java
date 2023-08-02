package pt.mei.ea.taskr;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import pt.mei.ea.taskr.models.*;
import pt.mei.ea.taskr.repositories.*;

import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Configuration
class LoadDatabase {

    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);


    @Bean
    CommandLineRunner initCategories(ServiceCategoryRepository repository, ServiceTypeRepository typeRepository) {
        return args -> {
            if (repository.count() == 0){
                ServiceCategory gardening = repository.save(new ServiceCategory("Gardening", ""));
                ServiceCategory assembling = repository.save(new ServiceCategory("Assembling", ""));
                ServiceCategory cleaning = repository.save(new ServiceCategory("Cleaning", ""));
                ServiceCategory fixing = repository.save(new ServiceCategory("Fixing", ""));
                ServiceCategory moving = repository.save(new ServiceCategory("Moving", ""));


                log.info("Preloading " + gardening);
                log.info("Preloading " + assembling);
                log.info("Preloading " + cleaning);
                log.info("Preloading " + fixing);
                log.info("Preloading " + moving);
                log.info("Preloading "+ typeRepository.save(new ServiceType(gardening, "Home Gardening", "Are you passionate about plants and gardening? Do you enjoy spending time outdoors, nurturing green spaces, and creating beautiful landscapes? If so, we have the perfect opportunity for you as a Home Gardening Specialist.", "home-gardening-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(gardening, "Irrigation System Installing", "The Irrigation System Installation Technician is responsible for installing and maintaining irrigation systems for residential, commercial, and agricultural properties. The technician will work closely with clients, landscape architects, and project managers to ensure the efficient and effective installation of irrigation systems. The role requires a strong understanding of irrigation equipment, technical skills, and the ability to work independently or as part of a team", "irrigation-system-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(assembling, "Furniture Assembling", "As a Furniture Assembler, your primary responsibility is to assemble various types of furniture according to specifications and instructions. You will work with a team or individually, depending on the company's structure and workload. Your attention to detail, manual dexterity, and ability to follow instructions are crucial in ensuring the quality and functionality of the assembled furniture.", "furniture-assembling-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(assembling, "Home Appliance Assembling", "As a Home Appliance Assembler, your role is to assemble various home appliances according to specifications and guidelines. Your attention to detail and ability to follow instructions will ensure the efficient and accurate assembly of appliances.", "appliance-installing-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(cleaning, "Home cleaning", "Clean homes", "home-cleaning-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(cleaning, "Clothes Laundry", "We are seeking a detail-oriented and reliable Laundry Attendant to join our team. As a Laundry Attendant, you will be responsible for performing various laundry tasks, ensuring clean and well-maintained linens, garments, and other items. Your attention to detail and ability to work efficiently will contribute to providing high-quality laundry services to our customers.", "laundry-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(fixing, "Plumbing", "We are seeking a skilled and experienced Plumber to join our team. As a Plumber, you will be responsible for installing, repairing, and maintaining plumbing systems in residential, commercial, and industrial settings. Your expertise in plumbing techniques and your ability to troubleshoot and solve plumbing issues will be essential in providing high-quality service to our customers.", "plumbing-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(fixing, "Electrical Services", "Electricians provide services such as fixing faulty wiring, repairing electrical outlets, installing light fixtures, ceiling fans, circuit breakers, and addressing electrical emergencies.", "electrician")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(moving, "Help in Moving", "We are seeking reliable and physically fit Moving Assistants to join our team. As a Moving Assistant, you will be responsible for assisting with all aspects of the moving process, ensuring the safe and efficient relocation of our clients' belongings. Your strength, attention to detail, and teamwork skills will be crucial in providing a positive moving experience for our customers.", "moving-img")));
                log.info("Preloading "+ typeRepository.save(new ServiceType(moving, "Trash Removing", "We are seeking a diligent and responsible Trash Removal Technician to join our team. As a Trash Removal Technician, you will be responsible for collecting and disposing of trash and waste materials from various locations. Your attention to detail, time management skills, and commitment to cleanliness and sanitation will contribute to maintaining a clean and healthy environment for our customers.", "trash-removing")));


            }
        };
    }

    Date dateOf(int year, int month, int day){
        return Date.from(LocalDate.of(year, month, day).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    public static BigDecimal generateRandomBigDecimalFromRange(BigDecimal min, BigDecimal max) {
        BigDecimal randomBigDecimal = min.add(BigDecimal.valueOf(Math.random()).multiply(max.subtract(min)));
        return randomBigDecimal.setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    public void initProviders(Provider provider,
                              ProviderServiceRepository providerServiceRepository,
                              ServiceAreaRepository serviceAreaRepository,
                              DistrictRepository districtRepository,
                              MunicipalityRepository municipalityRepository,
                              ServiceTypeRepository serviceTypeRepository,
                              AvailabilityIntervalRepository availabilityIntervalRepository,
                              NotificationRepository notificationRepository
                              ){
        Random random = new Random();

        District braga = districtRepository.findByName("Braga").get();
        List<Municipality> bragaMun = braga.getMunicipalities();
        List<Municipality> serviceAreasMunicipalities = new ArrayList<>();
        for(int i = 0; i < 6; i++) {
            int munIdx = random.nextInt(bragaMun.size());
            Municipality municipality = bragaMun.get(munIdx);
            while(serviceAreasMunicipalities.contains(municipality)) {
                munIdx = random.nextInt(bragaMun.size());
                municipality = bragaMun.get(munIdx);
            }
            serviceAreasMunicipalities.add(municipality);
        }

        for(Municipality mun: serviceAreasMunicipalities){
            ServiceArea sa = new ServiceArea(provider, braga, mun);
            serviceAreaRepository.save(sa);

        }

        List<ServiceType> providerServiceTypes = new ArrayList<ServiceType>();
        for(int i = 0; i < 4; i++) {
            long randServiceTypeId = random.nextLong(serviceTypeRepository.count()) + 1;
            ServiceType st = serviceTypeRepository.findById(randServiceTypeId).orElse(null);
            while(providerServiceTypes.contains(st)) {
                randServiceTypeId = random.nextLong(serviceTypeRepository.count()) + 1;
                st = serviceTypeRepository.findById(randServiceTypeId).orElse(null);
            }
            providerServiceTypes.add(st);
        }
        for(ServiceType serviceType: providerServiceTypes) {

            ProviderService ps1 = new ProviderService(
                    generateRandomBigDecimalFromRange(new BigDecimal("2"), new BigDecimal("20")),
                    Duration.of(1, ChronoUnit.HOURS),
                    "I provide this service :)",
                    serviceType,
                    provider
            );

            providerServiceRepository.save(ps1);
        }


        AvailabilityInterval ai1 = new AvailabilityInterval(
                provider,
                DayOfWeek.MONDAY,
                LocalTime.of(9, 0),
                LocalTime.of(12, 0)
        );
        AvailabilityInterval ai2 = new AvailabilityInterval(
                provider,
                DayOfWeek.TUESDAY,
                LocalTime.of(13, 0),
                LocalTime.of(18, 0)
        );
        AvailabilityInterval ai3 = new AvailabilityInterval(
                provider,
                DayOfWeek.WEDNESDAY,
                LocalTime.of(9, 0),
                LocalTime.of(14, 0)
        );
        AvailabilityInterval ai4 = new AvailabilityInterval(
                provider,
                DayOfWeek.THURSDAY,
                LocalTime.of(9, 0),
                LocalTime.of(12, 0)
        );
        AvailabilityInterval ai5 = new AvailabilityInterval(
                provider,
                DayOfWeek.THURSDAY,
                LocalTime.of(13, 0),
                LocalTime.of(18, 0)
        );
        AvailabilityInterval ai6 = new AvailabilityInterval(
                provider,
                DayOfWeek.FRIDAY,
                LocalTime.of(13, 0),
                LocalTime.of(18, 0)
        );
        AvailabilityInterval ai7 = new AvailabilityInterval(
                provider,
                DayOfWeek.FRIDAY,
                LocalTime.of(9, 0),
                LocalTime.of(12, 0)
        );
        AvailabilityInterval ai8 = new AvailabilityInterval(
                provider,
                DayOfWeek.SATURDAY,
                LocalTime.of(9, 0),
                LocalTime.of(12, 0)
        );
        AvailabilityInterval ai9 = new AvailabilityInterval(
                provider,
                DayOfWeek.SATURDAY,
                LocalTime.of(13, 0),
                LocalTime.of(18, 0)
        );

        availabilityIntervalRepository.save(ai1);
        availabilityIntervalRepository.save(ai2);
        availabilityIntervalRepository.save(ai3);
        availabilityIntervalRepository.save(ai4);
        availabilityIntervalRepository.save(ai5);
        availabilityIntervalRepository.save(ai6);
        availabilityIntervalRepository.save(ai7);
        availabilityIntervalRepository.save(ai8);
        availabilityIntervalRepository.save(ai9);
    }

    @Bean
    @Transactional
    CommandLineRunner initClients(UserRepository repository,
                                  ProviderRepository providerRepository,
                                  ProviderServiceRepository providerServiceRepository,
                                  ServiceAreaRepository serviceAreaRepository,
                                  DistrictRepository districtRepository,
                                  MunicipalityRepository municipalityRepository,
                                  ServiceTypeRepository serviceTypeRepository,
                                  AvailabilityIntervalRepository availabilityIntervalRepository,
                                  PasswordEncoder passwordEncoder,
                                  NotificationRepository notificationRepository) {

        return args -> {
            if(repository.count() == 0){
                log.info("Preloading " + repository.save(new Client("Bom Cliente", "email@mail.com", passwordEncoder.encode("password"), "910000000", dateOf(1990, 3, 3))));
                log.info("Preloading " + repository.save(new Client("Mau Cliente", "email2@mail.com", passwordEncoder.encode("password"), "910000001" , dateOf(1994, 5, 5))));
                log.info("Preloading " + repository.save(new Admin("Mau Admin", "emailAdmin@mail.com", passwordEncoder.encode("password"), "910453681" , dateOf(1994, 5, 5))));
                log.info("Preloading " + repository.save(new Provider("Joaquim Alberto","email3@mail.com", passwordEncoder.encode("password"), "910000002",  dateOf(1960, 7, 7), "123456789", "3-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Alberto Joaquim","email4@mail.com", passwordEncoder.encode("password"), "910000003",  dateOf(1969, 6, 9), "234567890", "4-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Manel dos Recados","email5@mail.com", passwordEncoder.encode("password"), "910000004",  dateOf(1980, 3, 2), "345678901", "5-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Joana Faz Tudo","email6@mail.com", passwordEncoder.encode("password"), "910000005",  dateOf(1988, 9, 11), "456789012", "6-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Rita Repara","email7@mail.com", passwordEncoder.encode("password"), "910000006",  dateOf(1985, 12, 12), "567890123", "7-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Luis Limpa","email8@mail.com", passwordEncoder.encode("password"), "910000007",  dateOf(1960, 7, 7), "678901234", "8-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Miguel Mudanças","email9@mail.com", passwordEncoder.encode("password"), "910000008",  dateOf(1969, 6, 9), "789012345", "9-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Alberto Arranja","email10@mail.com", passwordEncoder.encode("password"), "910000009",  dateOf(1980, 3, 2), "890123456", "10-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Maria Move","email11@mail.com", passwordEncoder.encode("password"), "910000010",  dateOf(1988, 9, 11), "901234568", "11-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Joaquina Jardina","email12@mail.com", passwordEncoder.encode("password"), "910000011",  dateOf(1985, 12, 12), "012345689", "12-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Inês Instala","email13@mail.com", passwordEncoder.encode("password"), "910000012",  dateOf(1985, 12, 12), "012345689", "13-profile-photo", Provider.ProviderState.accepted)));
                log.info("Preloading " + repository.save(new Provider("Cristina Concerta","email14@mail.com", passwordEncoder.encode("password"), "910000013",  dateOf(1985, 12, 12), "012345689", "14-profile-photo", Provider.ProviderState.accepted)));
            }

            if(providerServiceRepository.count() == 0){

                List<Provider> providers = providerRepository.findAllByIsDeletedIsFalse();
                for(Provider provider: providers){
                    initProviders(provider,
                             providerServiceRepository,
                             serviceAreaRepository,
                             districtRepository,
                             municipalityRepository,
                             serviceTypeRepository,
                             availabilityIntervalRepository,
                             notificationRepository
                    );
                }

            }
        };
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }


}