/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2024, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import mount from 'utils/mount';

import Annotations from './AnnotationsInspectorView.vue';

export default function AnnotationsViewProvider(openmct) {
  return {
    key: 'annotationsView',
    name: 'Annotations',
    canView: function (selection) {
      const availableTags = openmct.annotation.getAvailableTags();
      const selectionContext = selection?.[0]?.[0]?.context;
      const domainObject = selectionContext?.item;
      const isLayoutItem = selectionContext?.layoutItem;

      if (availableTags.length < 1 || isLayoutItem || !domainObject || openmct.editor.isEditing()) {
        return false;
      }

      const isAnnotatableType = openmct.annotation.isAnnotatableType(domainObject.type);
      const metadata = openmct.telemetry.getMetadata(domainObject);
      const hasImagery = metadata?.valuesForHints(['image']).length > 0;
      const isNotebookEntry = selectionContext?.type === 'notebook-entry-selection';
      const hasNumericTelemetry = openmct.telemetry.hasNumericTelemetry(domainObject);

      return isAnnotatableType || hasImagery || hasNumericTelemetry || isNotebookEntry;
    },
    view: function (selection) {
      let _destroy = null;

      const selectionContext = selection?.[0]?.[0]?.context;
      const isImageSelection = selectionContext?.type === 'clicked-on-image-selection';
      const domainObject = selectionContext?.item;
      const isNotebookEntry = selectionContext?.type === 'notebook-entry-selection';
      const isConditionSet = domainObject?.type === 'conditionSet';

      return {
        show: function (element) {
          const { destroy } = mount(
            {
              el: element,
              components: {
                Annotations
              },
              provide: {
                openmct,
                domainObject
              },
              template: `<Annotations />`
            },
            {
              app: openmct.app,
              element
            }
          );
          _destroy = destroy;
        },
        priority: function () {
          if (isNotebookEntry || isImageSelection) {
            return openmct.priority.HIGHEST;
          }

          if (isConditionSet) {
            return openmct.priority.LOW;
          }

          return openmct.priority.DEFAULT;
        },
        destroy: function () {
          if (_destroy) {
            _destroy();
          }
        }
      };
    }
  };
}
