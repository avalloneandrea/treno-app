import { Attachment } from './attachment.dto';

export class Message {

  channel?: string;
  text?: string;
  attachments?: Array<Attachment>;

}
