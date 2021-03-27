/// <reference types="common-types" />
import express, { RequestHandler, Request, Response } from 'express';
export type Handler = (
  req: Request,
  res?: Response
) => Promise<Record<string, unknown>>;
