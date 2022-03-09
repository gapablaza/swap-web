import { Collection, User } from '../models';

export const EXAMPLE_USER: User = {
        'accountTypeId': 2,
        'accountTypeName': 'PRO',
        'bio': 'Wsp. +56999686369',
        'daysSinceLogin': 0,
        'daysSinceRegistration': 758,
        'disabled': false,
        'displayName': 'Cristian Sanchez (MN)',
        'epochLastLogin': 1605578535,
        'epochRegistration': 1540068269,
        'facebook': '935849899939689',
        'google': '102277757923985781914',
        'id': 5440,
        'image': 'https:\/\/lh3.googleusercontent.com\/-l1UrvD0cyBk\/AAAAAAAAAAI\/AAAAAAAAABY\/y_UnVCMQIhA\/s200\/photo.jpg',
        'isMod': false,
        'lastLogin': '2020-11-16T23:02:15-03:00',
        'location': 'Concepci\u00f3n, Chile',
        'location_city': 'Concepci\u00f3n',
        'location_country': 'Chile',
        'notifyUnreadMessages': true,
        'registration': '2018-10-20T17:44:29-03:00',
        'collections': 42,
        'completedCollections': 17,
        'wishing': 1144,
        'trading': 3862,
        'positives': 44,
        'negatives': 5
    };

export const EXAMPLE_USER_COLLECTIONS: Collection[] = [
    {
        'id': 2,
        'name': 'FIFA World Cup Brazil 2014',
        'year': 2014,
        'release': '2014-06-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_2.jpg',
        'items': 640,
        'created': '2016-08-29T14:52:38-03:00',
        'updated': '2020-11-16T06:00:31-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 67,
            'completed': true,
            'progress': 100,
            'created': '2020-09-06T14:53:24-03:00',
            'updated': '2020-09-06T16:47:35-03:00'
        }
    },
    {
        'id': 4,
        'name': 'Copa Am\u00e9rica Chile 2015',
        'year': 2015,
        'release': '2015-04-05 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_4.jpg',
        'items': 348,
        'created': '2016-08-29T14:52:39-03:00',
        'updated': '2020-11-16T06:00:31-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 86,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T12:06:46-03:00',
            'updated': '2020-09-07T12:19:05-03:00'
        }
    },
    {
        'id': 6,
        'name': 'Campeonato Nacional Scotiabank 2014-2015',
        'year': 2014,
        'release': '2014-12-05 20:00:00',
        'description': '<p>Enlaces de inter&eacute;s:<br \/><i class=\'icon icon-caretright\'><\/i><a href=\'http:\/\/collectibles.panini.cl\/editorial\/album-oficial-apertura-2014-2015-campeonato-nacional.html\' target=\'_blank\'>P&aacute;gina oficial<\/a><br \/><i class=\'icon icon-caretright\'><\/i><a href=\'https:\/\/www.youtube.com\/watch?v=14ndl_oLIuQ\' target=\'_blank\'>Video &aacute;lbum completo<\/a><br \/><\/p>',
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_6.jpg',
        'items': 417,
        'created': '2017-09-26T00:04:22-03:00',
        'updated': '2020-11-16T06:00:31-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 78,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T12:29:24-03:00',
            'updated': '2020-11-16T17:26:10-03:00'
        }
    },
    {
        'id': 10,
        'name': 'Princesita Sof\u00eda',
        'year': 2015,
        'release': '2015-04-02 10:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_10.jpg',
        'items': 168,
        'created': '2016-08-29T14:52:41-03:00',
        'updated': '2020-11-15T06:00:30-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 46,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T11:05:24-03:00',
            'updated': '2020-09-07T11:13:26-03:00'
        }
    },
    {
        'id': 13,
        'name': 'Road to 2014 FIFA World Cup Brazil',
        'year': 2013,
        'release': '2013-03-01 09:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_13.jpg',
        'items': 410,
        'created': '2015-07-21T16:57:02-03:00',
        'updated': '2020-11-15T06:00:30-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 49,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T11:24:43-03:00',
            'updated': '2020-09-07T11:29:48-03:00'
        }
    },
    {
        'id': 15,
        'name': 'Campeonato Nacional de Apertura Petrobras 2013-2014',
        'year': 2013,
        'release': '2013-06-01 09:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_15.jpg',
        'items': 417,
        'created': '2015-07-21T16:57:02-03:00',
        'updated': '2020-11-15T06:00:31-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 129,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T10:39:12-03:00',
            'updated': '2020-11-16T17:24:38-03:00'
        }
    },
    {
        'id': 22,
        'name': 'Frozen 2 \u2013 Momentos M\u00e1gicos',
        'year': 2014,
        'release': '2014-10-25 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_22.jpg',
        'items': 204,
        'created': '2015-07-21T16:57:02-03:00',
        'updated': '2020-11-13T06:00:23-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 0,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T12:22:36-03:00',
            'updated': '2020-09-07T12:22:56-03:00'
        }
    },
    {
        'id': 103,
        'name': 'Campeonato Nacional Scotiabank 2015-2016',
        'year': 2015,
        'release': '2015-08-14 12:00:00',
        'description': '<p>Enlaces de inter&eacute;s:<br \/><i class=\'icon icon-caretright\'><\/i><a href=\'http:\/\/collectibles.panini.cl\/editorial\/album-oficial-2015-campeonato-nacional-scotiabank.html\' target=\'_blank\'>P&aacute;gina oficial<\/a><br \/><i class=\'icon icon-caretright\'><\/i><a href=\'https:\/\/www.youtube.com\/watch?v=CxgedidOsqA\' target=\'_blank\'>Video &aacute;lbum completo<\/a><br \/><\/p>',
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_103.jpg',
        'items': 382,
        'created': '2017-09-26T00:02:04-03:00',
        'updated': '2020-11-16T06:00:33-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 77,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T12:24:12-03:00',
            'updated': '2020-09-07T12:28:19-03:00'
        }
    },
    {
        'id': 126,
        'name': 'El mundo de Mickey y Donald',
        'year': 2011,
        'release': '2011-01-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_126.jpg',
        'items': 228,
        'created': '2015-10-17T00:30:09-03:00',
        'updated': '2020-11-16T06:00:33-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 88,
            'trading': 68,
            'completed': false,
            'progress': 61,
            'created': '2020-11-10T16:44:04-03:00',
            'updated': '2020-11-12T15:43:19-03:00'
        }
    },
    {
        'id': 253,
        'name': 'Copa Am\u00e9rica Centenario USA 2016',
        'year': 2016,
        'release': '2016-04-04 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_253.jpg',
        'items': 459,
        'created': '2016-07-30T18:54:49-04:00',
        'updated': '2020-11-16T06:00:35-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 0,
            'completed': true,
            'progress': 100,
            'created': '2016-06-14T13:30:20-04:00',
            'updated': '2020-08-18T19:33:34-04:00'
        }
    },
    {
        'id': 257,
        'name': 'Ositos Cari\u00f1ositos',
        'year': 2016,
        'release': '2016-04-22 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_257.jpg',
        'items': 189,
        'created': '2016-04-24T00:43:28-03:00',
        'updated': '2020-11-04T06:00:14-03:00',
        'publisher':
        {
            'data':
            {
                'id': 6,
                'name': 'Ansaldo',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 52,
            'completed': true,
            'progress': 100,
            'created': '2016-06-14T13:07:42-04:00',
            'updated': '2020-09-07T11:19:21-03:00'
        }
    },
    {
        'id': 345,
        'name': 'Universidad de Chile 2011-2012',
        'year': 2012,
        'release': '2012-01-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_345.jpg',
        'items': 181,
        'created': '2016-07-21T18:56:04-04:00',
        'updated': '2020-11-13T06:00:27-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 19,
            'completed': true,
            'progress': 100,
            'created': '2020-09-07T11:22:07-03:00',
            'updated': '2020-09-07T11:23:14-03:00'
        }
    },
    {
        'id': 527,
        'name': 'Trolls',
        'year': 2016,
        'release': '2016-10-21 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_527.jpg',
        'items': 180,
        'created': '2016-10-27T03:29:28-03:00',
        'updated': '2020-11-04T06:00:17-03:00',
        'publisher':
        {
            'data':
            {
                'id': 3,
                'name': 'Topps',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 0,
            'completed': true,
            'progress': 100,
            'created': '2016-12-16T23:23:27-03:00',
            'updated': '2020-08-18T19:34:42-04:00'
        }
    },
    {
        'id': 538,
        'name': 'Campeonato Nacional Scotiabank 2016-2017',
        'year': 2016,
        'release': '2016-11-25 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_538.jpg',
        'items': 280,
        'created': '2016-11-25T22:06:40-03:00',
        'updated': '2020-11-16T06:00:39-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 0,
            'completed': true,
            'progress': 100,
            'created': '2016-12-17T00:11:41-03:00',
            'updated': '2020-08-17T15:37:49-04:00'
        }
    },
    {
        'id': 674,
        'name': 'Condorito La Pel\u00edcula',
        'year': 2017,
        'release': '2017-09-20 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_674.jpg',
        'items': 160,
        'created': '2017-09-27T21:08:42-03:00',
        'updated': '2020-11-12T06:00:27-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 127,
            'completed': true,
            'progress': 100,
            'created': '2020-09-16T18:56:53-03:00',
            'updated': '2020-09-21T16:19:28-03:00'
        }
    },
    {
        'id': 1163,
        'name': 'L.O.L. Surprise! Vamos a ser Amigos - Mu\u00f1ecas LOL',
        'year': 2019,
        'release': '2019-03-25 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1163.jpg',
        'items': 254,
        'created': '2019-03-28T02:03:52-03:00',
        'updated': '2020-11-15T06:00:41-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 137,
            'completed': true,
            'progress': 100,
            'created': '2019-05-26T19:27:08-04:00',
            'updated': '2020-08-18T16:32:53-04:00'
        }
    },
    {
        'id': 1164,
        'name': 'Copa Am\u00e9rica Brasil 2019 - CONMEBOL',
        'year': 2019,
        'release': '2019-03-26 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1164.jpg',
        'items': 400,
        'created': '2019-03-28T02:03:52-03:00',
        'updated': '2020-11-16T06:00:45-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 261,
            'completed': true,
            'progress': 100,
            'created': '2019-05-25T22:25:59-04:00',
            'updated': '2020-08-18T15:54:54-04:00'
        }
    },
    {
        'id': 1194,
        'name': 'FIFA Women\'s World Cup France 2019',
        'year': 2019,
        'release': '2019-04-29 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1194.jpg',
        'items': 480,
        'created': '2019-05-01T16:53:39-04:00',
        'updated': '2020-11-16T06:00:45-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 119,
            'completed': true,
            'progress': 100,
            'created': '2020-08-17T17:09:10-04:00',
            'updated': '2020-08-26T19:55:14-04:00'
        }
    },
    {
        'id': 1212,
        'name': 'Toy Story 4',
        'year': 2019,
        'release': '2019-01-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1212.jpg',
        'items': 266,
        'created': '2019-06-03T05:37:25-04:00',
        'updated': '2020-11-16T06:00:45-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 81,
            'trading': 78,
            'completed': false,
            'progress': 70,
            'created': '2020-11-10T16:29:59-03:00',
            'updated': '2020-11-16T19:59:36-03:00'
        }
    },
    {
        'id': 1232,
        'name': 'Mickey Mouse Sticker Story 90 A\u00f1os',
        'year': 2019,
        'release': '2019-07-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1232.jpg',
        'items': 312,
        'created': '2019-07-19T04:15:09-04:00',
        'updated': '2020-11-16T06:00:45-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 155,
            'completed': true,
            'progress': 100,
            'created': '2020-08-31T12:07:03-04:00',
            'updated': '2020-10-28T20:41:03-03:00'
        }
    },
    {
        'id': 1456,
        'name': 'Copa Am\u00e9rica Argentina 2021 Colombia - CONMEBOL - Preview',
        'year': 2020,
        'release': '2020-08-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1456.jpg',
        'items': 400,
        'created': '2020-08-07T03:01:15-04:00',
        'updated': '2020-11-16T06:00:48-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 270,
            'completed': true,
            'progress': 100,
            'created': '2020-08-11T19:43:49-04:00',
            'updated': '2020-11-16T17:26:55-03:00'
        }
    },
    {
        'id': 1458,
        'name': 'L.O.L. Surprise! Fashion Fun! - Mu\u00f1ecas LOL',
        'year': 2020,
        'release': '2020-08-02 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1458.jpg',
        'items': 204,
        'created': '2020-08-12T02:57:36-04:00',
        'updated': '2020-08-12T02:57:36-04:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 0,
            'trading': 164,
            'completed': true,
            'progress': 100,
            'created': '2020-08-13T13:40:07-04:00',
            'updated': '2020-09-11T21:50:05-03:00'
        }
    },
    {
        'id': 1496,
        'name': 'El Chapul\u00edn Colorado & El Chavo',
        'year': 2020,
        'release': '2020-11-02 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_1496.jpg',
        'items': 210,
        'created': '2020-11-11T01:23:51-03:00',
        'updated': '2020-11-11T01:23:51-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'summary':
        {
            'wishing': 12,
            'trading': 165,
            'completed': false,
            'progress': 94,
            'created': '2020-11-11T17:58:10-03:00',
            'updated': '2020-11-12T11:52:50-03:00'
        }
    }
];

export const EXAMPLE_USER_COLLECTION: any = {
    'info':
    {
        'id': 232,
        'name': 'Amigos Animales',
        'year': 2012,
        'release': '2012-01-01 12:00:00',
        'description': null,
        'image': 'https:\/\/cdn.intercambialaminas.com\/collections\/collection_232.jpg',
        'items': 372,
        'created': '2015-11-15T01:39:18-03:00',
        'updated': '2020-11-21T06:00:10-03:00',
        'publisher':
        {
            'data':
            {
                'id': 1,
                'name': 'Panini',
                'description': null,
                'image': null
            }
        },
        'collecting': true,
        'completed': false,
        'wishing': 9,
        'trading': 50
    },
    'tradelist': [
    {
        'id': 57391,
        'name': '8',
        'description': 'L\u00e1mina #8',
        'image': null,
        'position': 57391,
        'difficulty': '0.38',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-19T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57403,
        'name': '20',
        'description': 'L\u00e1mina #20',
        'image': null,
        'position': 57403,
        'difficulty': '0.64',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-10-24T06:00:36-03:00',
        'quantity': 1
    },
    {
        'id': 57405,
        'name': '22',
        'description': 'L\u00e1mina #22',
        'image': null,
        'position': 57405,
        'difficulty': '0.57',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57409,
        'name': '26',
        'description': 'L\u00e1mina #26',
        'image': null,
        'position': 57409,
        'difficulty': '0.60',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-19T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57439,
        'name': '56',
        'description': 'L\u00e1mina #56',
        'image': null,
        'position': 57439,
        'difficulty': '0.38',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57442,
        'name': '59',
        'description': 'L\u00e1mina #59',
        'image': null,
        'position': 57442,
        'difficulty': '0.38',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57446,
        'name': '63',
        'description': 'L\u00e1mina #63',
        'image': null,
        'position': 57446,
        'difficulty': '0.69',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-10-17T06:00:19-03:00',
        'quantity': 1
    },
    {
        'id': 57463,
        'name': '80',
        'description': 'L\u00e1mina #80',
        'image': null,
        'position': 57463,
        'difficulty': '0.30',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57466,
        'name': '83',
        'description': 'L\u00e1mina #83',
        'image': null,
        'position': 57466,
        'difficulty': '0.42',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57467,
        'name': '84',
        'description': 'L\u00e1mina #84',
        'image': null,
        'position': 57467,
        'difficulty': '0.71',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57471,
        'name': '88',
        'description': 'L\u00e1mina #88',
        'image': null,
        'position': 57471,
        'difficulty': '0.22',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57482,
        'name': '99',
        'description': 'L\u00e1mina #99',
        'image': null,
        'position': 57482,
        'difficulty': '0.73',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-10-21T06:00:28-03:00',
        'quantity': 1
    },
    {
        'id': 57512,
        'name': '129',
        'description': 'L\u00e1mina #129',
        'image': null,
        'position': 57512,
        'difficulty': '0.82',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-08-18T06:00:50-04:00',
        'quantity': 1
    },
    {
        'id': 57515,
        'name': '132',
        'description': 'L\u00e1mina #132',
        'image': null,
        'position': 57515,
        'difficulty': '0.64',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-09-21T06:00:11-03:00',
        'quantity': 1
    },
    {
        'id': 57521,
        'name': '138',
        'description': 'L\u00e1mina #138',
        'image': null,
        'position': 57521,
        'difficulty': '0.50',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57526,
        'name': '143',
        'description': 'L\u00e1mina #143',
        'image': null,
        'position': 57526,
        'difficulty': '0.60',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57535,
        'name': '152',
        'description': 'L\u00e1mina #152',
        'image': null,
        'position': 57535,
        'difficulty': '0.38',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57536,
        'name': '153',
        'description': 'L\u00e1mina #153',
        'image': null,
        'position': 57536,
        'difficulty': '0.32',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57558,
        'name': '175',
        'description': 'L\u00e1mina #175',
        'image': null,
        'position': 57558,
        'difficulty': '0.42',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-10-24T06:00:37-03:00',
        'quantity': 1
    },
    {
        'id': 57561,
        'name': '178',
        'description': 'L\u00e1mina #178',
        'image': null,
        'position': 57561,
        'difficulty': '0.83',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-10-24T06:00:37-03:00',
        'quantity': 1
    },
    {
        'id': 57569,
        'name': '186',
        'description': 'L\u00e1mina #186',
        'image': null,
        'position': 57569,
        'difficulty': '1.30',
        'difficultyCategoryId': 3,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57573,
        'name': '190',
        'description': 'L\u00e1mina #190',
        'image': null,
        'position': 57573,
        'difficulty': '0.39',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57574,
        'name': '191',
        'description': 'L\u00e1mina #191',
        'image': null,
        'position': 57574,
        'difficulty': '0.71',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57575,
        'name': '192',
        'description': 'L\u00e1mina #192',
        'image': null,
        'position': 57575,
        'difficulty': '0.67',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57577,
        'name': '194',
        'description': 'L\u00e1mina #194',
        'image': null,
        'position': 57577,
        'difficulty': '0.53',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57580,
        'name': '197',
        'description': 'L\u00e1mina #197',
        'image': null,
        'position': 57580,
        'difficulty': '0.50',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-10-21T06:00:28-03:00',
        'quantity': 1
    },
    {
        'id': 57586,
        'name': '203',
        'description': 'L\u00e1mina #203',
        'image': null,
        'position': 57586,
        'difficulty': '0.74',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57614,
        'name': '231',
        'description': 'L\u00e1mina #231',
        'image': null,
        'position': 57614,
        'difficulty': '0.42',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57628,
        'name': '245',
        'description': 'L\u00e1mina #245',
        'image': null,
        'position': 57628,
        'difficulty': '0.39',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57639,
        'name': '256',
        'description': 'L\u00e1mina #256',
        'image': null,
        'position': 57639,
        'difficulty': '1.18',
        'difficultyCategoryId': 3,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57660,
        'name': '277',
        'description': 'L\u00e1mina #277',
        'image': null,
        'position': 57660,
        'difficulty': '0.53',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57668,
        'name': '285',
        'description': 'L\u00e1mina #285',
        'image': null,
        'position': 57668,
        'difficulty': '0.17',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57669,
        'name': '286',
        'description': 'L\u00e1mina #286',
        'image': null,
        'position': 57669,
        'difficulty': '0.15',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57670,
        'name': '287',
        'description': 'L\u00e1mina #287',
        'image': null,
        'position': 57670,
        'difficulty': '0.12',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57671,
        'name': '288',
        'description': 'L\u00e1mina #288',
        'image': null,
        'position': 57671,
        'difficulty': '0.25',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57672,
        'name': '289',
        'description': 'L\u00e1mina #289',
        'image': null,
        'position': 57672,
        'difficulty': '0.17',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-10-24T06:00:37-03:00',
        'quantity': 1
    },
    {
        'id': 57673,
        'name': '290',
        'description': 'L\u00e1mina #290',
        'image': null,
        'position': 57673,
        'difficulty': '0.16',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-10-21T06:00:28-03:00',
        'quantity': 1
    },
    {
        'id': 57674,
        'name': '291',
        'description': 'L\u00e1mina #291',
        'image': null,
        'position': 57674,
        'difficulty': '0.12',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-19T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57676,
        'name': '293',
        'description': 'L\u00e1mina #293',
        'image': null,
        'position': 57676,
        'difficulty': '0.14',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-09-21T06:00:11-03:00',
        'quantity': 1
    },
    {
        'id': 57678,
        'name': '295',
        'description': 'L\u00e1mina #295',
        'image': null,
        'position': 57678,
        'difficulty': '0.06',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-19T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57680,
        'name': '297',
        'description': 'L\u00e1mina #297',
        'image': null,
        'position': 57680,
        'difficulty': '0.75',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57682,
        'name': '299',
        'description': 'L\u00e1mina #299',
        'image': null,
        'position': 57682,
        'difficulty': '0.73',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57684,
        'name': '301',
        'description': 'L\u00e1mina #301',
        'image': null,
        'position': 57684,
        'difficulty': '0.71',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57692,
        'name': '309',
        'description': 'L\u00e1mina #309',
        'image': null,
        'position': 57692,
        'difficulty': '0.71',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-20T06:00:46-03:00',
        'quantity': 1
    },
    {
        'id': 57707,
        'name': '324',
        'description': 'L\u00e1mina #324',
        'image': null,
        'position': 57707,
        'difficulty': '0.59',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-10-24T06:00:37-03:00',
        'quantity': 1
    },
    {
        'id': 57720,
        'name': '337',
        'description': 'L\u00e1mina #337',
        'image': null,
        'position': 57720,
        'difficulty': '0.60',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57724,
        'name': '341',
        'description': 'L\u00e1mina #341',
        'image': null,
        'position': 57724,
        'difficulty': '0.60',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57741,
        'name': '358',
        'description': 'L\u00e1mina #358',
        'image': null,
        'position': 57741,
        'difficulty': '1.08',
        'difficultyCategoryId': 3,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57749,
        'name': '366',
        'description': 'L\u00e1mina #366',
        'image': null,
        'position': 57749,
        'difficulty': '0.44',
        'difficultyCategoryId': 1,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    },
    {
        'id': 57753,
        'name': '370',
        'description': 'L\u00e1mina #370',
        'image': null,
        'position': 57753,
        'difficulty': '0.85',
        'difficultyCategoryId': 2,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    }],
    'wishlist': [
    {
        'id': 57419,
        'name': '36',
        'description': 'L\u00e1mina #36',
        'image': null,
        'position': 57419,
        'difficulty': '4.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57457,
        'name': '74',
        'description': 'L\u00e1mina #74',
        'image': null,
        'position': 57457,
        'difficulty': '29.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57473,
        'name': '90',
        'description': 'L\u00e1mina #90',
        'image': null,
        'position': 57473,
        'difficulty': '23.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57475,
        'name': '92',
        'description': 'L\u00e1mina #92',
        'image': null,
        'position': 57475,
        'difficulty': '31.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57537,
        'name': '154',
        'description': 'L\u00e1mina #154',
        'image': null,
        'position': 57537,
        'difficulty': '12.50',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-21T06:00:10-03:00',
        'quantity': 1
    },
    {
        'id': 57549,
        'name': '166',
        'description': 'L\u00e1mina #166',
        'image': null,
        'position': 57549,
        'difficulty': '8.33',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57612,
        'name': '229',
        'description': 'L\u00e1mina #229',
        'image': null,
        'position': 57612,
        'difficulty': '12.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57658,
        'name': '275',
        'description': 'L\u00e1mina #275',
        'image': null,
        'position': 57658,
        'difficulty': '5.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:43-03:00',
        'quantity': 1
    },
    {
        'id': 57729,
        'name': '346',
        'description': 'L\u00e1mina #346',
        'image': null,
        'position': 57729,
        'difficulty': '27.00',
        'difficultyCategoryId': 5,
        'created': null,
        'updated': '2020-11-18T06:00:44-03:00',
        'quantity': 1
    }]
};
