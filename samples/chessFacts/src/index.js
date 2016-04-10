/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Chess Facts for a chess fact"
 *  Alexa: "Here's your chess fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.echo-sdk-ams.app.ef76fa47-c9c9-4e43-b50e-d42d499be820'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing chess facts.
 */
var CHESS_FACTS = [
    "The longest game of chess that is theoretically possible is five thousand nine hundred forty nine moves.",
    "From the starting position, there are eight different ways to Mate in two moves and three hundred fifty-five different ways to Mate in three moves.",
    "The first Chessboard with alternating light and dark squares appears in Europe in ten ninety.",
    "The word Checkmate in Chess comes from the Persian phrase Shah Mat, which means the King is dead.",
    "There are well over one-thousand different openings, including variations within larger openings/defenses that one can learn.",
    "The second book ever printed in the English language was about chess.",
    "About Six hundred million people know how to play chess worldwide.",
    "In many languages, the Pawn is a foot soldier, but in German and Spanish, it’s a peasant or farmer, instead.",
    "The first child prodigy of Chess was Paul Morphy. He learned the moves at the age of 8 and beat the strongest players in New Orleans at 11.",
    "Chess is called the game of kings, because for many centuries it was played primarily by nobility and the upper classes.",
    "The knight's role has been stable over time. Even in the earliest versions of the game, it represented the cavalry and had the unique ability to leap over its opponents.",
    "Chess was in fact invented in India. It is believed to originate out of India during the Gupta empire.",
    "Pawns are the only piece in chess that cannot move backwards.",
    "When a pawn gets to the end of the board, it can promote itself to a Knight, Bishop, Rook, or Queen.",
    "There are 20 possible first moves in chess.",
    "It is possible to have 18 queens on the board at once.",
    "The shortest game possible is two moves.",
    "The queen is the most powerful piece, but the king is the most valuable.",
    "In order to know which way to orient a chess board, make sure there is a white square on the bottom right.",
    "The queen always starts on her color."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * ChessFacts is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ChessFacts = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ChessFacts.prototype = Object.create(AlexaSkill.prototype);
ChessFacts.prototype.constructor = ChessFacts;

ChessFacts.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ChessFacts onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

ChessFacts.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ChessFacts onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
ChessFacts.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("ChessFacts onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

ChessFacts.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Chess Facts tell me a chess fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random chess fact from the chess facts list
    var factIndex = Math.floor(Math.random() * CHESS_FACTS.length);
    var fact = CHESS_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your chess fact: " + fact;

    response.tellWithCard(speechOutput, "ChessFacts", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the ChessFacts skill.
    var chessFacts = new ChessFacts();
    chessFacts.execute(event, context);
};
