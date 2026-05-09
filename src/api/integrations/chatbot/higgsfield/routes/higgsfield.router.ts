import { RouterBroker } from '@api/abstract/abstract.router';
import { IgnoreJidDto } from '@api/dto/chatbot.dto';
import { InstanceDto } from '@api/dto/instance.dto';
import { HttpStatus } from '@api/routes/index.router';
import { higgsfieldController } from '@api/server.module';
import {
  higgsfieldIgnoreJidSchema,
  higgsfieldSchema,
  higgsfieldSettingSchema,
  higgsfieldStatusSchema,
  instanceSchema,
} from '@validate/validate.schema';
import { RequestHandler, Router } from 'express';

import { HiggsfieldDto, HiggsfieldSettingDto } from '../dto/higgsfield.dto';

export class HiggsfieldRouter extends RouterBroker {
  constructor(...guards: RequestHandler[]) {
    super();
    this.router
      .post(this.routerPath('create'), ...guards, async (req, res) => {
        const response = await this.dataValidate<HiggsfieldDto>({
          request: req,
          schema: higgsfieldSchema,
          ClassRef: HiggsfieldDto,
          execute: (instance, data) => higgsfieldController.createBot(instance, data),
        });
        res.status(HttpStatus.CREATED).json(response);
      })
      .get(this.routerPath('find'), ...guards, async (req, res) => {
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: instanceSchema,
          ClassRef: InstanceDto,
          execute: (instance) => higgsfieldController.findBot(instance),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .get(this.routerPath('fetch/:higgsfieldId'), ...guards, async (req, res) => {
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: instanceSchema,
          ClassRef: InstanceDto,
          execute: (instance) => higgsfieldController.fetchBot(instance, req.params.higgsfieldId),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .put(this.routerPath('update/:higgsfieldId'), ...guards, async (req, res) => {
        const response = await this.dataValidate<HiggsfieldDto>({
          request: req,
          schema: higgsfieldSchema,
          ClassRef: HiggsfieldDto,
          execute: (instance, data) => higgsfieldController.updateBot(instance, req.params.higgsfieldId, data),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .delete(this.routerPath('delete/:higgsfieldId'), ...guards, async (req, res) => {
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: instanceSchema,
          ClassRef: InstanceDto,
          execute: (instance) => higgsfieldController.deleteBot(instance, req.params.higgsfieldId),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .post(this.routerPath('settings'), ...guards, async (req, res) => {
        const response = await this.dataValidate<HiggsfieldSettingDto>({
          request: req,
          schema: higgsfieldSettingSchema,
          ClassRef: HiggsfieldSettingDto,
          execute: (instance, data) => higgsfieldController.settings(instance, data),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .get(this.routerPath('fetchSettings'), ...guards, async (req, res) => {
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: instanceSchema,
          ClassRef: InstanceDto,
          execute: (instance) => higgsfieldController.fetchSettings(instance),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .post(this.routerPath('changeStatus'), ...guards, async (req, res) => {
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: higgsfieldStatusSchema,
          ClassRef: InstanceDto,
          execute: (instance, data) => higgsfieldController.changeStatus(instance, data),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .get(this.routerPath('fetchSessions/:higgsfieldId'), ...guards, async (req, res) => {
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: instanceSchema,
          ClassRef: InstanceDto,
          execute: (instance) => higgsfieldController.fetchSessions(instance, req.params.higgsfieldId),
        });
        res.status(HttpStatus.OK).json(response);
      })
      .post(this.routerPath('ignoreJid'), ...guards, async (req, res) => {
        const response = await this.dataValidate<IgnoreJidDto>({
          request: req,
          schema: higgsfieldIgnoreJidSchema,
          ClassRef: IgnoreJidDto,
          execute: (instance, data) => higgsfieldController.ignoreJid(instance, data),
        });
        res.status(HttpStatus.OK).json(response);
      });
  }

  public readonly router: Router = Router();
}
