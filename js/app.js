(function () {
    var timelineModule = (function () {
        var config = {
            url: 'https://uxd.firebaseio.com/education',
            startId: 1,
            numQueryElements: 5
        };

        var module = {
            getEducationHistory: getEducationHistory
        };

        var firebaseRef = new Firebase(config.url);

        return module;

        function getEducationHistory() {
            var deferred = $.Deferred();

            firebaseRef
                .orderByChild('_id')
                .startAt(config.startId)
                .limitToFirst(config.numQueryElements)
                .once('value', function (snapShot) {
                    var historyObject = snapShot.val();

                    if (historyObject === null) {
                        return deferred.reject();
                    }

                    // convert object to array
                    var historyCollection = objectToArray(historyObject);
                    historyCollection = historyCollection.filter(isNotUndefinied);

                    config.startId = historyCollection[historyCollection.length - 1]['_id'] + 1;

                    deferred.resolve(historyCollection);
                });

            return deferred.promise();
        }

        function objectToArray(obj) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        }

        function isNotUndefinied(item) {
            return item !== undefined;
        }
    })();

    var templateRenderer = (function () {
        var config = {
            timelineTemplate: null,
            skillTemplate: null
        };

        var module = {
            loadTemplates: loadTemplates,
            renderTimelineItem: renderTimelineItem,
            renderSkillItem: renderSkillItem
        };

        return module;

        function loadTemplates() {
            config.timelineTemplate = $('#timeline-template').html();
            config.skillTemplate = $('#skill-template').html();
        }

        function renderTimelineItem(date, title, content) {
            var timelineItem = config.timelineTemplate
                .replace(/{{ date }}/g, date)
                .replace(/{{ title }}/g, title)
                .replace(/{{ content }}/g, content);

            return $(timelineItem);
        }

        function renderSkillItem(name, level) {
            var skillItem = config.skillTemplate
                .replace(/{{ skill-name }}/g, name);

            var $item = $(skillItem);

            $item.children('div').css({
                width: level + '%'
            });

            return $item;
        }
    })();

    $(function () {
        templateRenderer.loadTemplates();

        // timeline first elements loading
        loadTimelilneElements();

        applyStyles();
        setupHandlers();
    });

    function applyStyles() {
        $('article[data-skill-panel]').hover(showSkillButton, hideSkillButton);

        $('#btn-toggle-add-skills').on('click', toogleSkillPanel);

        $('#col-left, #col-right').sortable({
            connectWith: 'section[data-list]',
            handle: 'h2',
            start: addDraggableClass,
            beforeStop: removeDraggableClass
        });

        function showSkillButton() {
            $('#btn-toggle-add-skills').fadeIn(100);
        }

        function hideSkillButton() {
            $('#btn-toggle-add-skills').fadeOut(100);
        }

        function toogleSkillPanel() {
            $('#manage-skills-panel').toggle({duration: 300});
        }

        function addDraggableClass(event, ui) {
            $(ui.helper).addClass('group-item-draggable');
        }

        function removeDraggableClass(event, ui) {
            $(ui.helper).removeClass('group-item-draggable');
        }
    }

    function loadTimelilneElements() {
        timelineModule.getEducationHistory().then(function (historyCollection) {
            var items = [];
            var numHistoryElemnts = historyCollection.length;

            for (var i = 0; i < numHistoryElemnts; i++) {
                var $item = templateRenderer.renderTimelineItem(
                    historyCollection[i]['date'],
                    historyCollection[i]['title'],
                    historyCollection[i]['description']
                );

                items.push($item);
            }

            $('ul.timeline').append(items);
        });
    }

    function setupHandlers() {
        $('#manage-skills-panel').on('submit', addNewSkill);
        $('div[data-scroll]').on('scroll', handleTimelineScroll);

        function addNewSkill() {
            event.preventDefault();

            var $element = $(this);

            var $skillName = $element.find('#skill-name');
            var $skillLevel = $element.find('#skill-level');

            var $item = templateRenderer.renderSkillItem($skillName.val(), $skillLevel.val());

            $('.skills-graph ul').append($item);

            $skillName.val('');
            $skillLevel.val('');
        }

        function handleTimelineScroll() {
            var $element = $(this);

            var scrollHeight = $element.prop('scrollHeight');
            var divHeight = $element.height();
            var scrollerEndPoint = scrollHeight - divHeight;

            var divScrollerTop = $element.scrollTop();

            if (divScrollerTop === scrollerEndPoint) {
                loadTimelilneElements();
            }
        }
    }
})();