import { MessageFactory } from './message.factory';
import { Message } from '../domain/message.dto';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';

describe('MessageFactory', () => {

  it('should build an home message', () => {
    const wrapper: Wrapper = { event: { channel: 'CH4NN3L' } };
    const message: Message = MessageFactory.home(wrapper);
    expect(message.channel).toEqual('CH4NN3L');
    expect(message.text).toContain(':tada: Benvenuto in Treno!');
  });

  it('should build an help message', () => {
    const wrapper: Wrapper = { event: { channel: 'CH4NN3L' } };
    const message: Message = MessageFactory.help(wrapper);
    expect(message.channel).toEqual('CH4NN3L');
    expect(message.text).toContain(':wave: Hai bisogno di aiuto con Treno?');
  });

  it('should build a status message for a valid train', () => {
    const wrapper: Wrapper = { event: { channel: 'CH4NN3L' } };
    const status: Status = { ok: true, provvedimento: 0, compRitardoAndamento: [ '' ] };
    const message: Message = MessageFactory.status(wrapper, status);
    expect(message.channel).toEqual('CH4NN3L');
    expect(message.text).toContain('Il treno');
    expect(message.text).toContain('proveniente da');
    expect(message.text).toContain('delle ore');
    expect(message.text).toContain('viaggia');
  });

  it('should build a status message for a canceled train', () => {
    const wrapper: Wrapper = { event: { channel: 'CH4NN3L' } };
    const status: Status = { ok: true, provvedimento: 1 };
    const message: Message = MessageFactory.status(wrapper, status);
    expect(message.channel).toEqual('CH4NN3L');
    expect(message.text).toContain('Il treno');
    expect(message.text).toContain('proveniente da');
    expect(message.text).toContain('delle ore');
    expect(message.text).toContain('è stato cancellato');
  });

  it('should build a status message for a canceled train', () => {
    const wrapper: Wrapper = { event: { channel: 'CH4NN3L' } };
    const status: Status = { ok: false };
    const message: Message = MessageFactory.status(wrapper, status);
    expect(message.channel).toEqual('CH4NN3L');
    expect(message.text).toContain('Treno non trovato');
  });

});
