import { describe, expect, it } from 'vitest'

import {
  checkText,
  commands,
  commandsAsText,
  findPalette,
  formatAddress,
  matchCommands,
  normalizeHex,
  parseAddress,
  parseCommand,
} from '@/ai/commands'
import { checkImageUrl, FetchImageError, fetchImage, isPrivateAddress } from '@/ai/fetchImage'
import { matchTopic } from '@/ai/helpKnowledge'

describe('assistant commands', () => {
  it('parses a command and its argument', () => {
    expect(parseCommand('/phone 302-555-0100')).toEqual({ name: 'phone', arg: '302-555-0100' })
    expect(parseCommand('  /LOGO  ')).toEqual({ name: 'logo', arg: '' })
    expect(parseCommand('/hours Monday to Friday,\n7 to 5')).toEqual({
      name: 'hours',
      arg: 'Monday to Friday,\n7 to 5',
    })
    expect(parseCommand('how do I change the logo?')).toBeNull()
    expect(parseCommand('/admin/globals/theme')).toBeNull()
    expect(parseCommand('/')).toBeNull()
  })

  it('suggests commands while typing, hiding manager ones from editors', () => {
    expect(matchCommands('/lo', true).map((c) => c.name)).toEqual(['logo', 'logo-dark'])
    expect(matchCommands('/', true)).toHaveLength(commands.length)
    expect(matchCommands('/lo', false)).toEqual([])
    expect(matchCommands('/', false).map((c) => c.name)).toEqual(['photos', 'project', 'help'])
    expect(matchCommands('/phone 3', true)).toEqual([])
    expect(matchCommands('/phone ', true)).toEqual([])
    expect(matchCommands('hello', true)).toEqual([])
  })

  it('checks phone numbers and email addresses', () => {
    expect(checkText('phone', '302-555-0100')).toBeNull()
    expect(checkText('phone', '+1 (302) 555 0100')).toBeNull()
    expect(checkText('phone', 'call me')).toMatch(/phone number/)
    expect(checkText('phone', '12-34')).toMatch(/phone number/)
    expect(checkText('email', 'office@example.com')).toBeNull()
    expect(checkText('email', 'office@example')).toMatch(/email/)
    expect(checkText('hours', 'x'.repeat(161))).toMatch(/too long/)
    expect(checkText('tagline', '')).toBeNull()
  })

  it('splits an address into street, town, state and zip', () => {
    expect(parseAddress('12 Main St, Lewes, DE 19958')).toEqual({
      street: '12 Main St',
      city: 'Lewes',
      state: 'DE',
      zip: '19958',
    })
    expect(parseAddress('Unit 4, 100 Coastal Hwy, Rehoboth Beach, de')).toEqual({
      street: 'Unit 4, 100 Coastal Hwy',
      city: 'Rehoboth Beach',
      state: 'DE',
      zip: '',
    })
    expect(parseAddress('12 Main St Lewes DE')).toBeNull()
    expect(parseAddress('12 Main St, Lewes, Delaware')).toBeNull()
    expect(formatAddress({ street: '12 Main St', city: 'Lewes', state: 'DE', zip: '19958' })).toBe(
      '12 Main St, Lewes, DE 19958',
    )
    expect(formatAddress(null)).toBe('')
  })

  it('reads colours and palette names', () => {
    expect(normalizeHex('#1d5fa8')).toBe('#1D5FA8')
    expect(normalizeHex('1D5FA8')).toBe('#1D5FA8')
    expect(normalizeHex('#abc')).toBe('#ABC')
    expect(normalizeHex('blue')).toBeNull()
    expect(findPalette('studio')?.key).toBe('studio')
    expect(findPalette('Studio Paper')?.key).toBe('studio')
    expect(findPalette('')).toBeUndefined()
    expect(findPalette('zzz-not-a-palette')).toBeUndefined()
  })

  it('is known to the help topics and the AI', () => {
    expect(matchTopic('gõ lệnh trong chat')?.id).toBe('commands')
    expect(commandsAsText()).toContain('/logo')
    expect(commandsAsText()).toContain('/color <#hex>')
  })
})

describe('photo links', () => {
  it('spots private and internal addresses', () => {
    for (const ip of [
      '127.0.0.1',
      '10.1.2.3',
      '172.16.0.1',
      '172.31.255.255',
      '192.168.1.10',
      '169.254.169.254',
      '100.64.0.1',
      '0.0.0.0',
      '::1',
      'fd00::1',
      'fe80::1',
      '::ffff:127.0.0.1',
      'not-an-ip',
    ])
      expect(isPrivateAddress(ip), ip).toBe(true)
    for (const ip of ['8.8.8.8', '103.74.102.24', '172.32.0.1', '2606:4700::1111'])
      expect(isPrivateAddress(ip), ip).toBe(false)
  })

  it('refuses links that are not plain public web links', () => {
    expect(checkImageUrl('https://example.com/logo.png').hostname).toBe('example.com')
    for (const bad of [
      'ftp://example.com/a.png',
      'file:///etc/passwd',
      'javascript:alert(1)',
      'http://localhost/a.png',
      'http://127.0.0.1/a.png',
      'http://[::1]/a.png',
      'http://169.254.169.254/latest/meta-data',
      'http://example.com:8080/a.png',
      'https://user:pass@example.com/a.png',
      'http://printer.local/a.png',
      'not a link',
    ])
      expect(() => checkImageUrl(bad), bad).toThrow(FetchImageError)
  })

  it('refuses a name that resolves to a private address', async () => {
    // a trailing dot slips past the name check; the lookup at connection time still refuses it
    await expect(fetchImage('http://localhost./a.png')).rejects.toThrow(FetchImageError)
  })
})
