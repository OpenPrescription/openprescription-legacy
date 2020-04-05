## Open Prescription
#### Open Prescription is a system for authenticating and signing medical prescriptions by validated doctors using a digital certificate and drug dispensing tracking

The idea grew during the COVID-19 pandemic, and because of quarantines, visiting doctors could put people in risk of being contaminated.

As many countries lack about telemedicine or have treatments prescriptions on paper yet, we designed a simple platform that can be deployed as a crisis response at the same time mitigates frauds on prescriptions and drug dispensing.

The platform has a simple flow for the 3 defined main actors: doctor, patient and pharmacist.

### Premises:
* Privacy: Must preserve the privacy of the medical prescriptions of the patient,
* Confidentiality: Just the parties involved should access the content,
* Proof-of-Authenticity: All the generated data must be authenticated to prove the integrity of all documents,
* Proof-of-Authorship: The doctor must sign the prescription with a validated identity and using a digital certificate,
* Proof-of-Consent: Every time personal data is requested to the patients they should agree, and the consent must be verifiable
* Traceability: All actions must be trackable and auditable,
* Transparent: The platform must be transparent and verifiable to leverage the Trust during the whole process

### Digital Identity
A digital identity is needed for signing the prescriptions and authorising the drug dispensing.

The digital signatures are made with a digital certificate, initially blockchain-based.

The digital signatures are compatible with open standards and can be verified in different platforms

### Blockchain
Used to authenticate the prescriptions and provide access to a traceability layer for governments and regulators.

Documents authenticated on blockchain have a timestamp and can be verified at any time.

#### Smart-contracts
It can't be considered a smart-contract, but a repository of all activities of drug dispensing, on an anonymised form. It will be used by governments and regulators to track prescriptions and drug dispensing acts.

No documents, contents or personally identifiable information should be exposed on blockchain for privacy and confidentiality purposes, in respect of GDPR (Europe) and countries like Brazil (LGPD)

### Validating Doctors
Through countries API's or platforms to check the doctor speciality and their registry number.


### Sequence diagram
![docs/Open%20Prescriptions%20User%20Flow.png](https://raw.githubusercontent.com/OpenPrescription/openprescription/master/docs/Open%20Prescriptions%20User%20Flow.png)

### To do
* Encrypted (and possibly decentralised) storage plugin
* Digital signatures by the pharmacist
* Smart-contract(s) for activities repository

### Sponsors, partnerships and contributors
[OriginalMy](https://originalmy.com)
[E-Pro Saúde](https://e-prosaude.com.br)


### License
MIT
