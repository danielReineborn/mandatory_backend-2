/* 
lists:
{
  _id: ObjectId,
  name: string,
}

cards: 
{
  _id: ObjectId,
  list: string,
  name: string,
  date: string,
  description: string,
  comment: string,
  checklist: id -> use this id to match with todos?
}

todos: 
{
  _id: ObjectId,
  checklist: id -> matching with card.checklist.
  task: string
}
*/