import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TauxValuesService {

	tauxTypes:any = {
		T20 : [
			{
				name: "140 - Prestations de services",
				value: 140
			},
			{
				name: "145 - Achat à l'importation",
				value: 145
			},
			{
				name: "146 - Achat à l'intérieur",
				value: 146
			},
			{
				name: "155 - Travaux à façon",
				value: 155
			},
			{
				name: "156 - Sous traitance (travaux immobilier)",
				value: 156
			},
			{
				name: "162 - Achat à l'importation",
				value: 162
			},
			{
				name: "163 - Achat à l'intérieur",
				value: 163
			},
			{
				name: "164 - Livraison à soi-même autre que les constructions",
				value: 164
			},
			{
				name: "165 - Instalation et pose",
				value: 165
			},
			{
				name: "166 - Constructions",
				value: 166
			},
			{
				name: "167 - Livraison à soi-même autre de constructions",
				value: 167
			},
			{
				name: "Autres",
				value: 0
			}
		],
		T14 : [
			{
				name: "141 - Transport",
				value: 141
			},
			{
				name: "147 - Achat à l'importation",
				value: 147
			},
			{
				name: "148 - Achat à l'intérieur",
				value: 148
			},
			{
				name: "168 - Autres immobilisations",
				value: 168
			},
			{
				name: "Autres",
				value: 0
			}
		],
		T10 : [
			{
				name: "142 - Operation de banque",
				value: 142
			},
			{
				name: "143 - Hôtels de voyageurs et ensemble immobilier â destination touristique",
				value: 143
			},
			{
				name: "144 - Les operations des acocats, interprétes, notaires, adoul, huissiers de justice et vétérinaires",
				value: 144
			},
			{
				name: "153 - Autres prestations de services",
				value: 153
			},
			{
				name: "149 - Achat à l'importation",
				value: 149
			},
			{
				name: "150 - Achat à l'intérieur",
				value: 150
			},
			{
				name: "Autres",
				value: 0
			}
		],
		T7 : [
			{
				name: "151 - Achat à l'importation",
				value: 151
			},
			{
				name: "152 - Achat à l'intérieur",
				value: 152
			},
			{
				name: "169 - Autres immobilisations",
				value: 169
			},
			{
				name: "Autres",
				value: 0
			}
		]
	};

	keywords:any = {
		transport : ['transport', 'TRANSPORT'],
		bank : ['banque', 'bancaire', 'bancaires', 'bank', 'commissions', 'COMMISSIONS', 'BANCAIRE', 'BANCAIRES', 'BANK', 'BANQUE']
	};
	
	outputs:any = {
		bank : {
			taux : 10,
			db11 : 142
		},
		transport : {
			taux : 14,
			db11 : 141 
		}
	}
}
