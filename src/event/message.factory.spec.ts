import { MessageFactory } from './message.factory';

describe('MessageFactory', () => {

  it('should build an home opened message', () => {
    const channel = 'CH4NN3L';
    const wrapper = { event: { channel } };
    const message = MessageFactory.homeOpened(wrapper);
    expect(message.channel).toEqual(channel);
    expect(message.text).toContain(':tada: Benvenuto in Treno!');
  });

  it('should build an help message', () => {
    const channel = 'CH4NN3L';
    const wrapper = { event: { channel } };
    const message = MessageFactory.help(wrapper);
    expect(message.channel).toEqual(channel);
    expect(message.text).toContain(':wave: Hai bisogno di aiuto con Treno?');
  });

  it('should build a status message for a valid train', () => {
    const channel = 'CH4NN3L';
    const wrapper = { event: { channel } };
    const status = { ok: true, provvedimento: 0, compRitardoAndamento: [ '' ] };
    const message = MessageFactory.status(wrapper, status);
    expect(message.channel).toEqual(channel);
    expect(message.text).toContain('Il treno');
    expect(message.text).toContain('proveniente da');
    expect(message.text).toContain('delle ore');
    expect(message.text).toContain('viaggia');
  });

  it('should build a status message for a canceled train', () => {
    const channel = 'CH4NN3L';
    const wrapper = { event: { channel } };
    const status = { ok: true, provvedimento: 1 };
    const message = MessageFactory.status(wrapper, status);
    expect(message.channel).toEqual(channel);
    expect(message.text).toContain('Il treno');
    expect(message.text).toContain('proveniente da');
    expect(message.text).toContain('delle ore');
    expect(message.text).toContain('è stato cancellato');
  });

  it('should build a status message for an invalid train', () => {
    const channel = 'CH4NN3L';
    const wrapper = { event: { channel } };
    const status = { ok: false };
    const message = MessageFactory.status(wrapper, status);
    expect(message.channel).toEqual(channel);
    expect(message.text).toContain('Treno non trovato');
  });

});
