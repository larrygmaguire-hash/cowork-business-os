/**
 * Scholar Search Wizard.
 *
 * Analyses a raw query to detect disciplines, suggest optimal sources,
 * and generate structured questions for the user before searching.
 */
import { WizardResult } from "./types.js";
export declare function runWizard(query: string): WizardResult;
