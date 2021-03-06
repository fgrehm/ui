/**
 * Magic time parsing, based on Simon Willison's Magic date parser
 * @see http://simon.incutio.com/archive/2003/10/06/betterDateInput
 * @author Stoyan Stefanov &lt;stoyan@phpied.com&gt;
 */


/**
 * This is the place to customize the result format,
 * once the date is figured out
 *
 * @param Date d A date object
 * @return string A time string in the preferred format
 */
function getReadable(d) {
    return padAZero(d.getHours())
           + ':'
           + padAZero(d.getMinutes())
           + ':'
           + padAZero(d.getSeconds());
}
/**
 * Helper function to pad a leading zero to an integer
 * if the integer consists of one number only.
 * This function s not related to the algo, it's for
 * getReadable()'s purposes only.
 *
 * @param int s An integer value
 * @return string The input padded with a zero if it's one number int
 * @see getReadable()
 */
function padAZero(s) {
    s = s.toString();
    if (s.length == 1) {
        return '0' + s;
    } else {
        return s;
    }
}


/**
 * Array of objects, each has:
 * <ul><li>'re' - a regular expression</li>
 * <li>'handler' - a function for creating a date from something
 *     that matches the regular expression</li>
 * <li>'example' - an array of examples that show matching examples</li>
 * Handlers may throw errors if string is unparseable.
 * Examples are used for automated testing, so they should be updated
 *   once a regexp is added/modified.
 */
var timeParsePatterns = [
    // Now
    {   re: /^now/i,
        example: new Array('now'),
        handler: function() {
            return new Date();
        }
    },
    // p.m.
    {   re: /(\d{1,2}):(\d{1,2}):(\d{1,2})(?:p| p)/,
        example: new Array('9:55:00 pm','12:55:00 p.m.','9:55:00 p','11:5:10pm','9:5:1p'),
        handler: function(bits) {
            var d = new Date();
            var h = parseInt(bits[1], 10);
            if (h < 12) {h += 12;}
            d.setHours(h);
            d.setMinutes(parseInt(bits[2], 10));
            d.setSeconds(parseInt(bits[3], 10));
            return d;
        }
    },
    // p.m., no seconds
    {   re: /(\d{1,2}):(\d{1,2})(?:p| p)/,
        example: new Array('9:55 pm','12:55 p.m.','9:55 p','11:5pm','9:5p'),
        handler: function(bits) {
            var d = new Date();
            var h = parseInt(bits[1], 10);
            if (h < 12) {h += 12;}
            d.setHours(h);
            d.setMinutes(parseInt(bits[2], 10));
            d.setSeconds(0);
            return d;
        }
    },
    // p.m., hour only
    {   re: /(\d{1,2})(?:p| p)/,
        example: new Array('9 pm','12 p.m.','9 p','11pm','9p'),
        handler: function(bits) {
            var d = new Date();
            var h = parseInt(bits[1], 10);
            if (h < 12) {h += 12;}
            d.setHours(h);
            d.setMinutes(0);
            d.setSeconds(0);
            return d;
        }
    },
    // hh:mm:ss
    {   re: /(\d{1,2}):(\d{1,2}):(\d{1,2})/,
        example: new Array('9:55:00','19:55:00','19:5:10','9:5:1','9:55:00 a.m.','11:55:00a'),
        handler: function(bits) {
            var d = new Date();
            d.setHours(parseInt(bits[1], 10));
            d.setMinutes(parseInt(bits[2], 10));
            d.setSeconds(parseInt(bits[3], 10));
            return d;
        }
    },
    // hh:mm
    {   re: /(\d{1,2}):(\d{1,2})/,
        example: new Array('9:55','19:55','19:5','9:55 a.m.','11:55a'),
        handler: function(bits) {
            var d = new Date();
            d.setHours(parseInt(bits[1], 10));
            d.setMinutes(parseInt(bits[2], 10));
            d.setSeconds(0);
            return d;
        }
    },
    // hhmmss
    {   re: /(\d{1,6})/,
        example: new Array('9','9a','9am','19','1950','195510','0955'),
        handler: function(bits) {
            var d = new Date();
            var h = bits[1].substring(0,2);
            var m = parseInt(bits[1].substring(2,4), 10);
            var s = parseInt(bits[1].substring(4,6), 10);
            if (isNaN(m)) {m = 0;}
            if (isNaN(s)) {s = 0;}
            d.setHours(parseInt(h, 10));
            d.setMinutes(parseInt(m, 10));
            d.setSeconds(parseInt(s, 10));
            return d;
        }
    },


];

/**
 * Method that loops through all regexp's examples and lists them.
 * Optionally, the method can also run tests with the examples.
 *
 * @param boolean run_test TRUE is tests should be run on the examples, FALSE if only to show examples
 * @return object An XML 'ul' node
 */
function getExamples(run_tests) {
    var xml = document.createElement('ul');
    xml.setAttribute('id', 'time-parser-examples');
    for (var i = 0; i < timeParsePatterns.length; i++) {
        try {
            var example = timeParsePatterns[i].example;
            for (var j = 0; j < example.length; j++) {
                var list_item = document.createElement('li');
                if (!run_tests) {
                    var list_item_value = document.createTextNode(example[j]);
                } else {
                    var parsed = parseTimeString(example[j])
                    var result = getReadable(parsed) + ' -> ' + parsed.toTimeString();
                    var list_item_value = document.createTextNode(example[j] + ' -> ' + result)
                }
                list_item.appendChild(list_item_value)
                xml.appendChild(list_item);
            }
        } catch(e){}
    }
    return xml;
}

/**
 * Parses a string to figure out the time it represents
 *
 * @param string s String to parse
 * @return Date a valid Date object
 * @throws Error
 */
function parseTimeString(s) {
    for (var i = 0; i < timeParsePatterns.length; i++) {
        var re = timeParsePatterns[i].re;
        var handler = timeParsePatterns[i].handler;
        var bits = re.exec(s);
        if (bits) {
            return handler(bits);
        }
    }
    throw new Error("Invalid time string");
}

function magicTime(input) {
    var messagespan = input.id + '-messages';
    try {
        var d = parseTimeString(input.value);
        input.value = getReadable(d);
        input.className = '';
        try {
            // Human readable time
            el = document.getElementById(messagespan);
            el.firstChild.nodeValue = d.toTimeString();
            el.className = 'normal';
        }
        catch (e) {
            // the message div is not in the document
        }
    }
    catch (e) {
        input.className = 'error';
        try {
            el = document.getElementById(messagespan);
            var message = e.message;
            // Fix for IE6 bug
            if (message.indexOf('is null or not an object') > -1) {
                message = 'Invalid time string';
            }
            el.firstChild.nodeValue = message;
            el.className = 'error';
        } catch (e){} // no message div
    }
}
