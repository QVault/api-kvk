export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			address: {
				Row: {
					addition: string | null;
					address_id: number;
					city_name: string | null;
					company_id: number | null;
					country_id: number | null;
					country_name: string | null;
					gac_code: number | null;
					gac_street_name: string | null;
					house_number: number | null;
					number: string | null;
					region: string | null;
					street_name: string | null;
					zone: string | null;
				};
				Insert: {
					addition?: string | null;
					address_id?: number;
					city_name?: string | null;
					company_id?: number | null;
					country_id?: number | null;
					country_name?: string | null;
					gac_code?: number | null;
					gac_street_name?: string | null;
					house_number?: number | null;
					number?: string | null;
					region?: string | null;
					street_name?: string | null;
					zone?: string | null;
				};
				Update: {
					addition?: string | null;
					address_id?: number;
					city_name?: string | null;
					company_id?: number | null;
					country_id?: number | null;
					country_name?: string | null;
					gac_code?: number | null;
					gac_street_name?: string | null;
					house_number?: number | null;
					number?: string | null;
					region?: string | null;
					street_name?: string | null;
					zone?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'address_company_id_fkey';
						columns: ['company_id'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					}
				];
			};
			branch: {
				Row: {
					branch_id: number;
					branch_type: string | null;
					code: string | null;
					company_id: number | null;
					description: string | null;
				};
				Insert: {
					branch_id?: number;
					branch_type?: string | null;
					code?: string | null;
					company_id?: number | null;
					description?: string | null;
				};
				Update: {
					branch_id?: number;
					branch_type?: string | null;
					code?: string | null;
					company_id?: number | null;
					description?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'branch_company_id_fkey';
						columns: ['company_id'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					}
				];
			};
			capital: {
				Row: {
					capital_id: number;
					company_id: number | null;
					currency: string | null;
					currency_id: number | null;
					end_year_capital: number | null;
					invested: number | null;
					start_year_capital: number | null;
				};
				Insert: {
					capital_id?: number;
					company_id?: number | null;
					currency?: string | null;
					currency_id?: number | null;
					end_year_capital?: number | null;
					invested?: number | null;
					start_year_capital?: number | null;
				};
				Update: {
					capital_id?: number;
					company_id?: number | null;
					currency?: string | null;
					currency_id?: number | null;
					end_year_capital?: number | null;
					invested?: number | null;
					start_year_capital?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'capital_company_id_fkey';
						columns: ['company_id'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					}
				];
			};
			company: {
				Row: {
					alternate_name: string | null;
					dossier_code: string | null;
					external_id: string | null;
					id: number;
					is_active: boolean | null;
					legal_form: string | null;
					name: string | null;
					objective: string | null;
					products_available: boolean | null;
					registration_number: number | null;
					status: string | null;
				};
				Insert: {
					alternate_name?: string | null;
					dossier_code?: string | null;
					external_id?: string | null;
					id?: number;
					is_active?: boolean | null;
					legal_form?: string | null;
					name?: string | null;
					objective?: string | null;
					products_available?: boolean | null;
					registration_number?: number | null;
					status?: string | null;
				};
				Update: {
					alternate_name?: string | null;
					dossier_code?: string | null;
					external_id?: string | null;
					id?: number;
					is_active?: boolean | null;
					legal_form?: string | null;
					name?: string | null;
					objective?: string | null;
					products_available?: boolean | null;
					registration_number?: number | null;
					status?: string | null;
				};
				Relationships: [];
			};
			data_version: {
				Row: {
					change_timestamp: string | null;
					changed_by: string | null;
					changed_column: string;
					external_id: string;
					new_value: string | null;
					old_value: string | null;
					record_id: number;
					table_name: string;
					version_id: number;
				};
				Insert: {
					change_timestamp?: string | null;
					changed_by?: string | null;
					changed_column: string;
					external_id: string;
					new_value?: string | null;
					old_value?: string | null;
					record_id: number;
					table_name: string;
					version_id?: number;
				};
				Update: {
					change_timestamp?: string | null;
					changed_by?: string | null;
					changed_column?: string;
					external_id?: string;
					new_value?: string | null;
					old_value?: string | null;
					record_id?: number;
					table_name?: string;
					version_id?: number;
				};
				Relationships: [];
			};
			management: {
				Row: {
					authority: string | null;
					birth_country: string | null;
					birth_place: string | null;
					company_id: number | null;
					holding_company_dossier_code: string | null;
					holding_company_id_ref: number | null;
					management_id: number;
					name: string | null;
					role: string | null;
					start_date: string | null;
					title: string | null;
				};
				Insert: {
					authority?: string | null;
					birth_country?: string | null;
					birth_place?: string | null;
					company_id?: number | null;
					holding_company_dossier_code?: string | null;
					holding_company_id_ref?: number | null;
					management_id?: number;
					name?: string | null;
					role?: string | null;
					start_date?: string | null;
					title?: string | null;
				};
				Update: {
					authority?: string | null;
					birth_country?: string | null;
					birth_place?: string | null;
					company_id?: number | null;
					holding_company_dossier_code?: string | null;
					holding_company_id_ref?: number | null;
					management_id?: number;
					name?: string | null;
					role?: string | null;
					start_date?: string | null;
					title?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'management_company_id_fkey';
						columns: ['company_id'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'management_holding_company_id_ref_fkey';
						columns: ['holding_company_id_ref'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
