export const Country = Object.freeze({
    EGYPT: 'egypt',
    UK: 'uk',
    USA: 'US',
    CANADA: 'ca'
});

export const CountryName = Object.freeze({
    [Country.EGYPT]: "Egypt",
    [Country.UK]: "United Kingdom",
    [Country.USA]: "United States",
    [Country.CANADA]: "Canada"
});

export const Governorates = {
    [Country.EGYPT]: [
        "Cairo", "Giza", "Alexandria", "Qalyubia", "Port Said",
        "Suez", "Dakahlia", "Sharqia", "Kalyubia", "Kafr El Sheikh",
        "Gharbia", "Monufia", "Beheira", "Ismailia", "Giza",
        "Beni Suef", "Faiyum", "Minya", "Asyut", "Sohag",
        "Qena", "Aswan", "Luxor", "Red Sea", "New Valley",
        "Matrouh", "North Sinai", "South Sinai"
    ],
    [Country.UK]: [],
    [Country.USA]: [],
    [Country.CANADA]: []
};
