/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Chess openings helper what the open game is."
 *  Alexa: "(reads back opening for open game)"
 */

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./openings');

var APP_ID = 'amzn1.echo-sdk-ams.app.ddb141aa-5c06-4f84-a685-24dc2cd998d9'; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * ChessOpeningHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ChessOpeningHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ChessOpeningHelper.prototype = Object.create(AlexaSkill.prototype);
ChessOpeningHelper.prototype.constructor = ChessOpeningHelper;

ChessOpeningHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Chess Opening Helper. You can ask a question like, what are the opening moves in the Ruy Lopez?... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

ChessOpeningHelper.prototype.intentHandlers = {
    "RecipeIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Moves for " + itemName,
            recipe = recipes[itemName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: recipe,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, recipe);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know the moves for the " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that opening. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions about chess openings such as, what are the moves of the english?, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what are the moves for the Kings Indian, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.NoIntent": function (intent, session, response) {
    trackEvent(
      'Intent',
      'AMAZON.NoIntent',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        var speechOutput = "Okay.";
        response.tell(speechOutput);
      });
    }
};

exports.handler = function (event, context) {
    var chessOpeningHelper = new ChessOpeningHelper();
    chessOpeningHelper.execute(event, context);
};


var GA_TRACKING_ID = 'UA-76816613-1';

function trackEvent(category, action, label, value, cb) {
  var data = {
    v: '1', // API Version.
    tid: GA_TRACKING_ID, // Tracking ID / Property ID.
    // Anonymous Client Identifier. Ideally, this should be a UUID that
    // is associated with particular user, device, or browser instance.
    cid: '555',
    t: 'event', // Event hit type.
    ec: category, // Event category.
    ea: action, // Event action.
    el: label, // Event label.
    ev: value, // Event value.
  };

  request.post(
    'http://www.google-analytics.com/collect', {
      form: data
    },
    function(err, response) {
      if (err) { return cb(err); }
      if (response.statusCode !== 200) {
        return cb(new Error('Tracking failed'));
      }
      cb();
    }
  );
}
