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

function myItemsInterceptor({ openmct, identifierObject, name }) {
  const myItemsModel = {
    identifier: identifierObject,
    name,
    type: 'folder',
    composition: [],
    location: 'ROOT'
  };

  return {
    appliesTo: (identifier) => {
      return (
        identifier.key === myItemsModel.identifier.key &&
        identifier.namespace === myItemsModel.identifier.namespace
      );
    },
    invoke: (identifier, object) => {
      if (!object || openmct.objects.isMissing(object)) {
        openmct.objects.save(myItemsModel);

        return myItemsModel;
      }

      return object;
    },
    priority: openmct.priority.HIGHEST
  };
}

export default myItemsInterceptor;
