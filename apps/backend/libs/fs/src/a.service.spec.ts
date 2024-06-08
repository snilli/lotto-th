import { describe, it } from 'vitest'
import { Digimon, extractChampionChart, extractCharactorBase } from './a.service'

const rookieList = `| Agumon      | AA | Candlemon | DA | Betamon       | IA |
| Biyomon     | AB | Crabmon   | DB | DemiDevimon   | IB |
| ClearAgumon | AC | Elecmon   | DC | Dokunemon     | IC |
| Gomamon     | AD | Floramon  | DD | Gazimon       | ID |
| Penguinmon  | AE | Gabumon   | DE | Gizamon       | IE |
| SnowAgumon  | AF | Gotsumon  | DF | Goburimon     | IF |
| Tapirmon    | AG | Palmon    | DG | Hagurumon     | IG |
| Tentomon    | AH | Patamon   | DH | Kunemon       | IH |
| ToyAgumon   | AI |                | Mushroomon    | II |
| Veemon      | AJ |                | Otamamon      | IJ |
                                    | SnowGoburimon | IK |
                                    | Syakomon      | IL |
                                    | Tsukaimon     | IM |`

const championList = `| Airdramon   | B  | AA | Akatorimon   | H  | DA | Bakemon      | P  | IA |
| Angemon     | C  | AB | Centarumon   | K  | DB | Cyclonemon   | O  | IB |
| Apemon      | E  | AC | Clockmon     | M  | DC | Darkrizamon  | O  | IC |
| Birdramon   | B  | AD | Coelamon     | J  | DD | D-Tyrannomon | O  | ID |
| Dolphmon    | D  | AE | Drimogenmon  | K  | DE | Deltamon     | O  | IE |
| Flamedramon | B  | AF | Flarerizamon | G  | DF | Devidramon   | O  | IF |
| Frigimon    | E  | AG | Icemon       | K  | DG | Devimon      | P  | IG |
| Garurumon   | E  | AH | J-Mojyamon   | K  | DH | Flymon       | S  | IH |
| Gatomon     | C  | AI | Kiwimon      | H  | DI | Gekomon      | Q  | II |
| Greymon     | A  | AJ | Kokatorimon  | H  | DJ | Gesomon      | Q  | IJ |
| Gururumon   | E  | AK | Meramon      | M  | DK | Guardromon   | T  | IK |
| Ikkakumon   | D  | AL | Monochromon  | G  | DL | Hyogamon     | R  | IL |
| Kabuterimon | F  | AM | MoriShellmon | J  | DM | IceDevimon   | P  | IM |
| Leomon      | C  | AN | MudFrigimon  | K  | DN | Kuwagamon    | S  | IN |
| Mojyamon    | E  | AO | Ninjamon     | I  | DO | Nanimon      | P  | IO |
| Piddomon    | C  | AP | N-Drimogemon | K  | DP | Numemon      | T  | IP |
| Saberdramon | B  | AQ | SandYanmamon | L  | DQ | Octomon      | Q  | IQ |
| ShimaUnimon | E  | AR | Seadramon    | J  | DR | Ogremon      | R  | IR |
| Tortomon    | D  | AS | Shellmon     | J  | DS | P-Sukamon    | T  | IS |
| Unimon      | E  | AT | Starmon      | I  | DT | Raremon      | T  | IT |
| Veedramon   | B  | AU | Tankmon      | M  | DU | RedVegiemon  | U  | IU |
                        | Togemon      | N  | DV | Soulmon      | P  | IV |
                        | Tyrannomon   | G  | DW | Sukamon      | T  | IW |
                        | Wizardmon    | I  | DX | Tuskmon      | O  | IX |
                        | Yanmamon     | L  | DY | Vegiemon     | U  | IY |
                                                 | Woodmon      | U  | IZ |`

const ultimateList = `| AeroVeedramon |A |AA| Blossomon     |G |DA| Cherrymon       |N |IA|
| Andromon      |B |AB| BlueMeramon   |H |DB| Datamon         |O |IB|
| Angewomon     |B |AC| Deramon       |I |DC| Dragmon         |P |IC|
| Garudamon     |A |AD| Digitamamon   |J |DD| Etemon          |Q |ID|
| Giromon       |B |AE| Lillymon      |G |DE| Extyrannomon    |R |IE|
| MagnaAngemon  |B |AF| Mamemon       |J |DF| Garbagemon      |O |IF|
| Mammothmon    |C |AG| MegaSeadramon |K |DG| Gigadramon      |R |IG|
| M-Tyrannomon  |D |AH| MetalMamemon  |J |DH| MarineDevimon   |P |IH|
| M-Kabuterimon |E |AI| Meteormon     |L |DI| Megadramon      |R |II|
| MetalGreymon  |D |AJ| Piximon       |I |DJ| MetalTyrannomon |R |IJ|
| Monzaemon     |C |AK| Pumpkinmon    |G |DK| Myotismon       |S |IK|
| Panjyamon     |B |AL| Scorpiomon    |K |DL| Okuwamon        |T |IL|
| Raidramon     |A |AM| SkullMeramon  |H |DM| Phantomon       |S |IM|
| WereGarurumon |C |AN| Tinmon        |H |DN| ShogunGekomon   |P |IN|
| Whamon        |F |AO| Triceramon    |M |DO| SkullGreymon    |R |IO|
| Zudomon       |F |AP| Vermillimon   |M |DP| Tekkamon        |S |IP|
                                            | Vademon         |O |IQ|
                                            | WaruMonzaemon   |Q |IR|
                                            | WaruSeadramon   |P |IS|`

const megaList = `| H-Kabuterimon | A  | Baihumon    | G  | Diaboromon     | M  |
| I-dramon      | B  | Boltmon     | H  | GranKuwagamon  | M  |
| Jijimon       | C  | Gryphonmon  | I  | Machinedramon  | N  |
| Magnadramon   | D  | Kimeramon   | H  | MetalEtemon    | O  |
| MarineAngemon | E  | M-Garurumon | G  | Pierrotmon     | P  |
| Omnimon       | F  | M-Seadramon | J  | Pukumon        | Q  |
| Phoenixmon    | B  | Preciomon   | J  | Puppetmon      | R  |
| Seraphimon    | D  | P-Mamemon   | K  | VenomMyotismon | P  |
| S-Mammothmon  | C  | Rosemon     | L  |
| WarGreymon    | F  | SaberLeomon | K  |`

// const championChart = `| |A |B |C |D |E |F |G |H |I |J |K |L |M |N |O |P |Q |R |S |T |U |
// |A|AA|AJ|AI|AA|AF|AJ|DC|DD|DH|DC|DE|DD|DC|DB|AA|AI|AA|AF|AH|AA|AE|
// |B|AJ|AB|AB|AB|AB|AH|DD|DD|DD|DD|DD|DD|DD|DG|AJ|AB|AB|AB|AH|AB|AH|
// |C|AI|AB|AC|AD|AI|AH|DH|DD|DH|DB|DH|DD|DF|DG|AI|AC|AD|AI|AH|AF|AH|
// |D|AA|AB|AD|AD|AG|AD|DC|DD|DB|DB|DF|DB|DB|DB|AA|AD|AD|AG|AD|AE|AE|
// |E|AF|AB|AI|AG|AG|AH|DD|DD|DH|DF|DE|DD|DF|DE|AF|AI|AG|AG|AH|AF|AG|
// |F|AJ|AH|AH|AD|AH|AH|DD|DD|DD|DB|DD|DD|DA|DD|AH|AH|AD|AH|AH|AH|AH|
// |G|DC|DD|DH|DC|DD|DD|DC|DD|DH|DC|DE|DD|DC|DB|IA|IM|IE|IF|IH|IE|IJ|
// |H|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DG|IC|IC|IC|IC|IH|IC|II|
// |I|DH|DD|DH|DB|DH|DD|DH|DD|DH|DB|DH|DD|DF|DG|IM|IB|IJ|ID|IH|IK|II|
// |J|DC|DD|DB|DB|DF|DB|DC|DD|DB|DB|DF|DB|DB|DB|IE|IJ|IL|IK|IL|IL|IJ|
// |K|DE|DD|DH|DF|DE|DD|DE|DD|DH|DF|DE|DD|DF|DE|IF|ID|IK|IF|IH|IK|IF|
// |L|DD|DD|DD|DB|DD|DD|DD|DD|DD|DB|DD|DD|DA|DD|IH|IH|IL|IH|IH|IG|IH|
// |M|DC|DD|DF|DB|DF|DB|DC|DD|DF|DB|DF|DA|DA|DA|IE|IK|IL|IK|IG|IG|IG|
// |N|DB|DG|DG|DB|DE|DD|DB|DG|DG|DB|DE|DD|DA|DG|IJ|II|IJ|IF|IH|IG|II|
// |O|AA|AJ|AI|AA|AF|AH|IA|IC|IM|IE|IF|IH|IE|IJ|IA|IM|IE|IF|IH|IE|IJ|
// |P|AI|AB|AC|AD|AI|AH|IM|IC|IB|IJ|ID|IH|IK|II|IM|IB|IJ|ID|IH|IK|II|
// |Q|AA|AB|AD|AD|AG|AD|IE|IC|IJ|IL|IK|IL|IL|IJ|IE|IJ|IJ|ID|IH|IK|II|
// |R|AF|AB|AI|AG|AG|AH|IF|IC|ID|IK|IF|IH|IK|IF|IF|ID|ID|IF|IH|IK|IF|
// |S|AH|AH|AH|AD|AH|AH|IH|IH|IH|IL|IH|IH|IG|IH|IH|IH|IH|IH|IH|IG|IH|
// |T|AA|AB|AF|AE|AF|AH|IE|IC|IK|IL|IK|IG|IG|IG|IE|IK|IK|IK|IG|IG|IG|
// |U|AE|AH|AH|AE|AG|AH|IJ|II|II|IJ|IF|IH|IG|II|IJ|II|II|IF|IH|IG|II|`

// const ultimateChart = `| |A |B |C |D |E |F |G |H |I |J |K |L |M |N |O |P |Q |R |S |T |
// |A|AD|AU|AQ|AU|AM|AA|DV|DI|DJ|DI|DA|DJ|DA|AM|AA|AA|AQ|AU|AU|AM|
// |B|AU|AB|AN|AI|AM|AL|DV|DB|DI|DT|DR|DO|DX|AM|AG|AL|AN|AI|AB|AM|
// |C|AQ|AN|AH|AR|AM|AO|DH|DN|DJ|DO|DP|DG|DE|AT|AC|AO|AH|AR|AN|AM|
// |D|AU|AI|AR|AJ|AM|AR|DM|DL|DA|DX|DF|DE|DW|MA|AJ|AJ|AR|AJ|AI|AM|
// |E|AM|AM|AM|AM|AM|AE|DY|DU|DY|DQ|DS|DQ|DQ|AM|AM|AE|AM|AM|AM|AM|
// |F|AA|AL|AO|AR|AE|AL|DM|DS|DA|DR|DR|DP|DF|MA|AE|AL|AO|AJ|AL|AE|
// |G|DV|DV|DH|DM|DY|DM|DV|DC|DV|DV|DM|DH|DM|IZ|IT|IK|IR|IK|IU|IN|
// |H|DI|DB|DN|DL|DU|DS|DC|DK|DI|DB|DS|DB|DL|IT|II|IQ|IL|IB|IL|IS|
// |I|DJ|DI|DJ|DA|DY|DA|DV|DI|DJ|DI|DI|DI|DA|IY|IH|IH|IH|IH|IH|IN|
// |J|DI|DT|DO|DX|DQ|DR|DV|DB|DI|DT|DR|DO|DX|IU|IL|IJ|IA|IM|IG|IN|
// |K|DA|DR|DP|DF|DS|DR|DM|DS|DI|DR|DR|DP|DF|IK|IQ|IQ|IL|IC|IJ|IJ|
// |L|DJ|DO|DG|DE|DQ|DP|DH|DB|DI|DO|DP|DG|DE|IR|IL|IL|IR|IR|IA|IN|
// |M|DA|DX|DE|DW|DQ|DP|DM|DL|DA|DX|DF|DE|DW|IK|IB|IC|IR|ID|IM|IN|
// |N|AM|AM|AT|MA|AM|MA|IZ|IT|IY|IU|IK|IR|IK|IZ|IT|IK|IR|IK|IU|IN|
// |O|AA|AG|AC|AJ|AM|AE|IT|II|IH|IL|IQ|IL|IB|IT|II|IQ|IL|IB|IL|IS|
// |P|AA|AL|AO|AJ|AE|AL|IK|IQ|IH|IJ|IQ|IL|IC|IK|IQ|IQ|IL|IC|IJ|IJ|
// |Q|AQ|AN|AH|AR|AM|AO|IR|IL|IH|IA|IL|IR|IR|IR|IL|IL|IR|IR|IA|IN|
// |R|AU|AI|AR|AJ|AM|AJ|IK|IB|IH|IM|IC|IR|ID|IK|IB|IC|IR|ID|IM|IN|
// |S|AU|AB|AN|AI|AM|AL|IU|IL|IH|IG|IJ|IA|IM|IU|IL|IJ|IA|IM|IG|IN|
// |T|AM|AM|AM|AM|AM|AE|IN|IS|IN|IN|IJ|IN|IN|IN|IS|IJ|IN|IN|IN|IN|`

describe('DigimonService', () => {
	it('should be defined', () => {
		const extractRookie = extractCharactorBase(2, 'rookie')
		const extractChampion = extractCharactorBase(3, 'champion')
		const extractUltimate = extractCharactorBase(3, 'ultimate')
		const extractMega = extractCharactorBase(2, 'mega')

		const digimon: Record<string, Record<string, Digimon>> = {}
		digimon['rookie'] = extractRookie(rookieList)
		digimon['champion'] = extractChampion(championList)
		digimon['ultimate'] = extractUltimate(ultimateList)
		digimon['mega'] = extractMega(megaList)

		extractChampionChart(ultimateChart, digimon['champion'], digimon['ultimate'])
	})
})
