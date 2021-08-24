import {Field} from 'Util/Query';

export class DynamicBlockQuery {
  getQuery({ id }) {
    if (!id) {
      throw new Error('Missing argument `id`');
    }

    return new Field('dynamicBlock')
    .addArgument('id', 'Int!', id)
    .addField('content');
  }
}

export default new DynamicBlockQuery();
