///DiffRule
///Правило проверки фиксирует факт создания нового оборудования без создания Asset.
///Доработано Мамаевым А.Р. (ОДУ Востока)1
{
	var result = new List<CheckResult>();
	var classes = new HashSet<string>(diffSource.GetMetaClassesByNames(new string[]{"Line","Substation","Breaker","PowerTransformer","SynchronousMachine","LinearShuntCompensator","StaticVarCompensator","SeriesCompensator"}).Select(item => item.Name));
	var addedObjects = diffSource.AddedObjects.Where(
	item =>(classes.Contains(item.ObjectClass.Name))).Select(item => item.ObjectUid);
	var deletedObjects = diffSource.DeletedObjects.Where(item =>( classes.Contains(item.ObjectClass.Name))).Select(item => item.ObjectUid);
	foreach(var objUid in addedObjects)
	{
		PowerSystemResource obj = (loadedSnapshot.GetObject(objUid) as PowerSystemResource);
		if (hasAssets(obj) != true)
		{
			result.Add(new CheckResult(obj.Id, String.Format("Добавилось оборудование, но у него не создан Asset/Facility, либо созданный Asset не привязан к оборудованию")));
		}
	}
	foreach(var objUid in deletedObjects)
	{
		var obj = (loadedSnapshot.GetObject(objUid) as PowerSystemResource);
		if (obj.Assets.FirstOrDefault() is null && (obj is Plant || obj is Substation || obj is Monitel.Mal.Context.CIM16.Line ) && !((obj is Substation) && (obj as Substation).Plant != null))
		{
			result.Add(new CheckResult(obj.Id, String.Format($"{getMAName(obj.Uid)}; {getParent(obj)}; Удален энергообъект, но у него не создан Facility с датой ввода, либо Facility не привязан к энергообъекту; {obj.Uid};{obj.name} ")));
		}
	}
	return result;
}
string getParent(PowerSystemResource psr) {
	var parent = psr.ParentObject;
	while (parent != null) {
		parent = parent.ParentObject;
		if (parent is SubGeographicalRegion)
			return parent.name;
		}
	return "-";
}
string getMAName(Guid uid) {
	var org = getMA(uid);
	if (org!=null) {
	if (org.name.Contains("ОДУ"))
		return $"{org.name};{org.name}";
	else
		return $"{org.ParentOrganisation.name};{org.name}";
	}
	return null;
}
Organisation getMA(Guid uid) {
	var io = loadedSnapshot.GetObject(uid) as IdentifiedObject;
	if (io.ModelingAuthoritySet!=null)
		return (Organisation) io.ModelingAuthoritySet.ModelingAuthority;
	if (io.ParentObject.ModelingAuthoritySet!=null)
		return (Organisation) io.ParentObject.ModelingAuthoritySet.ModelingAuthority;
	var parent = io.ParentObject;
	while (parent.ModelingAuthoritySet==null) {
		if (parent.ParentObject == null)
			return null;
		parent = parent.ParentObject;
	}
	return (Organisation) parent.ModelingAuthoritySet.ModelingAuthority;
}
bool hasAssets(PowerSystemResource obj)
{
	// MessageBox.Show("Дошёл 1");
	IdentifiedObject parObj = obj as IdentifiedObject;
	// MessageBox.Show("Дошёл 2");
	while (parObj.ParentObject != null)
	{
		// MessageBox.Show("Дошёл 3");
		//if (parObj == null) return false;
		// MessageBox.Show("Дошёл 4");
		if (parObj != null) 
		{
			// MessageBox.Show("Нашёл ассет");
			return true;
		}
		// MessageBox.Show("Дошёл 5");
		parObj = parObj.ParentObject;
		// MessageBox.Show("Дошёл 6");
	}
}