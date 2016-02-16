/* SOGoCASSession.h - this file is part of SOGo
 *
 * Copyright (C) 2010-2014 Inverse inc.
 *
 * This file is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2, or (at your option)
 * any later version.
 *
 * This file is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; see the file COPYING.  If not, write to
 * the Free Software Foundation, Inc., 59 Temple Place - Suite 330,
 * Boston, MA 02111-1307, USA.
 */

#ifndef SOGOCASSESSION_H
#define SOGOCASSESSION_H

/* implementation of the CAS protocol as required for a client/proxy:
   http://www.jasig.org/cas/protocol */


@class NSString;
@class NSMutableDictionary;

@interface SOGoCASSession : NSObject
{
  NSString *ticket;
  BOOL ticketFromProxy;
  NSString *login;
  NSString *pgt;
  NSString *identifier;
  NSMutableDictionary *proxyTickets;
  BOOL cacheUpdateNeeded;
  NSString *currentProxyService;
}

+ (NSString *) CASURLWithAction: (NSString *) casAction
                  andParameters: (NSDictionary *) parameters;

+ (SOGoCASSession *) CASSessionWithTicket: (NSString *) newTicket
                                fromProxy: (BOOL) fromProxy;
+ (SOGoCASSession *) CASSessionWithIdentifier: (NSString *) newIdentifier
                                fromProxy: (BOOL) fromProxy;

+ (void) handleLogoutRequest: (NSString *) logoutRequest;

- (NSString *) identifier;

- (NSString *) ticket;

- (NSString *) login;
- (NSString *) identifier;

- (NSString *) ticketForService: (NSString *) service;
- (void) invalidateTicketForService: (NSString *) service;

- (void) updateCache;

@end

@interface CASLogoutRequest : NSObject
{
  NSString *sessionIndex;
}

- (NSString *) sessionIndex;

@end

#endif /* SOGOCASSESSION_H */
