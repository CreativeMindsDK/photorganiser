/* This custom knockout binding uses/needs the vanilla js project https://github.com/Pixabay/JavaScript-autoComplete */
/* Example usage: 

<input type="text" data-bind="value: name, autoComplete: { options: parentFile.allKnownPersons, selectedOptions: parentFile.knownPersons, elementName: 'name' }" class="form-control" placeholder="Unknown" name="person" />

*/
/* It was built and tested with v1.0.4 */
import * as ko from "knockout";

declare var autoComplete: any;

ko.bindingHandlers.autoComplete = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var settings = valueAccessor();

        // Get the list of choices
        var options: string[] = settings.options;
        // Did we get a list with already selected options?
        var selectedOptions: any[] = settings.selectedOptions || [];
        // Is an element name provided?
        var elementName: string = settings.elementName || "";

        new autoComplete({
            selector: element,
            minChars: 2,
            cache: false,
            source: function (term: string, suggest: any) {
                var unwrappedSelectedOptions: any[] = ko.utils.unwrapObservable(selectedOptions);

                term = term.toLocaleLowerCase();
                var choices: string[] = ko.utils.unwrapObservable(options);
                unwrappedSelectedOptions.forEach((option) => {
                    choices = choices.filter((e) => {
                        if (elementName !== "") {
                            var v: string = ko.utils.unwrapObservable(option[elementName]);
                            return e.toLocaleLowerCase() !== v.toLocaleLowerCase();
                        }
                        return e !== option
                    });
                });

                var matches: string[] = [];
                choices.forEach((choice) => {
                    if (choice.toLocaleUpperCase().indexOf(term)) {
                        matches.push(choice);
                    }
                });
                suggest(matches);
            }
        });
    }
};

