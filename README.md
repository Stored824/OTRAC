# TeamsAndPlayers
Otvorena struktura podataka namjenjena za obavljanje prve laboratorijske vježbe predmeta Otvoreno Računarstvo.
Izrađeno 30.10.2022. verzija 1.0
Podaci su dostupni na engleskom jeziku.
Licenca projekta: Apache Commons licence 2.0
Za više detalja o licenci, pročitati LICENCE datoteku


## Korištene tehnologije
Baza podataka korištena za spremanje podataka je Postgres.
Dohvaćanje i spremanje podataka se obavlja putem Node.js sustava za jezik JavaScript.

## Struktura podataka
Podaci prikazuju podatke vezane uz nepostojeći, nespecificirani sport.
Podaci su organizirani unutar dvije, normalizirane tablice. 
Dvije tablice se dijele na popis nepostojećih, izmišljenih sportskih organizacija (zvani Team) i njihovih, isto tako izmišljenih, igrača (zvani Player).
Tablice su u organizirani 1 naspram n vezi, točnije svaka sportska organizacija ima barem jednog igrača, dok svaki igrač pripada točno jednoj organizaciji.

Atributi Team tablice (atributi su imenovani na engleskom jeziku):

         Team_ID: identifikator za tim unutar baze podataka
         name: službeno puno ime tima
         city: grad u kojem se tim trenutno nalazi
         expenses: godišnji operativni trošak tima u milijunima dolara
         income: godišnja primanja tima u milijunima dolara
         nickname: neslužbeni nadimak za tim
         championship_count: broj osvojenih prvenstva
         value: ukupna tržišna vrijednost tima
         country: država u kojoj se tim trenutno nalazi 
         fan_count: broj navijača
    
Atributi Player tablice (atributi su imenovani na engleskom jeziku):
        Player_ID:2,
        name: ime igrača
        surname: prezime igrača
        points: prosječni broj bodova po utakmici
        assists: prosječni broj asistencija po utakmici
        salary: plaća za trenutnu sezonu u milijunima dolara
        current_team: identifikator trenutnog tima
        
Atribut current_team je strani ključ kojime se pojedini igrač referencira na svoj tim. 



## Dostupni formati podataka
- Podaci su dostupni u tri formata
    - Comma Separated Value (CSV)
    - Javascript Object Notation (JSON)
    - Sql database dump


## Comma Separated Value
Postoji samo jedna .csv datoteka: TeamsAndPlayers.csv. Datoteka sadrži ispis svih igrača i njihovih timova.
Svaki red datoteke sadrži zapis igrača, svih njegovih atributa, ali i tim na kojem pripada te sve atribute njegovog tima.
Primjer jednog reda iz datoteke:

1,San Quentin Spongers,San Quentin,100,101,Sponges,0,220,United States of America,120000,1,John,Doe,1,2,10,1

## JavaScript Object Notation
Podaci spremljeni u JSON formatu su oblikovani kao lista objekata. Svaki objekt bilježi sve potrebne atribute jednog zapisa u bazi.
Postoje 3 JSON datoteke: teams.json, players.json te TeamsAndPlayers.json
- teams.json: popis svih timova i njihovih atributa, u popis nisu uključeni igrači, na primjer:
     {
         "Team_ID":2,
         "name":"London Loggers\n",
         "city":"London",
         "expenses":"120",
         "income":"110",
         "nickname":"Lions\n",
         "championship_count":1,
         "value":"345",
         "country":"United Kingdom\n",
         "fan_count":"21000"
    }
- players.json: popis svih igrača, nisu uključeni timovi
 {
    "Player_ID":2,
    "name":"Marcus",
    "surname":"Dark",
    "points":"2",
    "assists":"0",
    "salary":"11",
    "current_team":"1"
 }
- TeamsAndPlayers.json: popis timova koji ujedno imaju i igrače zapiane kao atribut pod ključem "players:"
{
    "Team_ID":2,
    "name":"London Loggers\n",
    "city":"London",
    "expenses":"120",
    "income":"110","nickname":"Lions\n",
    "championship_count":1,
    "value":"345",
    "country":"United Kingdom\n",
    "fan_count":"21000",
    "players":[
        {"Player_ID":3,"name":"Jesus","surname":"Sola","points":"3","assists":"2","salary":"20","current_team":"2"},
        {"Player_ID":4,"name":"Bob","surname":"Robertson","points":"4","assists":"1","salary":"11","current_team":"2"}
        ]
}


## Sql database dump
datoteka: TeamsAndPlayers.sql sadrži ispis sql zapisa baze podataka.
Opisuje stvaranje i strukturiranje tablica Team i Player

- Dohvaćanje podataka iz baze
    - CSV: CSV se može dohvatiti iz baze pokretanjem sljedeće skripte iz SQL Shell-a:
        COPY (select * from "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team") TO 'path\to\file\TeamsAndPlayers.csv'  WITH DELIMITER ',' CSV HEADER;
    - JSON: JSON se može stvoriti pokretanjem connection.js datoteke sljedećom naredbom: 
            node connection.js
    Pokretanjem ove naredbe, sustav ponovno čita bazu podataka te stvara nove teams.json, players.json te TeamsAndPlayers.json datoteke

## License
Apache Commons Licence 2.0
Za više detalja o licenci, pročitati LICENCE

