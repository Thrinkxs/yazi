import { Request, Response } from "express";
import { IEmployer } from "../api/models/Employer";
import { IIntern } from "../api/models/Intern";

export interface AdminAuthorizationHeader {
  adminID: string;
}

export interface ExtendedRequest extends Request {
  employer?: IEmployer;
  intern?: IIntern;
  //   admin?: IAdmin;
}

export interface ExtendedResponse extends Response {
  productID?: any;
  productData?: any;
}

export interface IJobFilter {
  jobID?: string;
  companyID?: string;
  search?: string;
  status?: string;
  type?: string;
  page?: string;
  limit?: string;
}

enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Prefer not to say",
}
export interface IInternFilter {
  address?: string;
  gender?: Gender;
  search?: string;
  status?: string;
  page?: string;
  limit?: string;
}

export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
