import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { Alert, View, Panel, PanelHeader, Group, InfoRow,FormLayout, FormLayoutGroup, Input,Select,Radio,Textarea,Checkbox, Link, Button,Div, Slider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

/*
function serialize(form)
{
	if (!form || form.nodeName !== "FORM") {
		return;
	}
	var i, j,
		obj = {'test':1};
	for (i = form.elements.length - 1; i >= 0; i = i - 1) {
		if (form.elements[i].name === "") {
			continue;
		}
		switch (form.elements[i].nodeName) {
		case 'INPUT':
			switch (form.elements[i].type) {
			case 'text':
			case 'hidden':
			case 'password':
			case 'button':
			case 'reset':
			case 'submit':
				obj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
				break;
			case 'checkbox':
			case 'radio':
				if (form.elements[i].checked) {
					obj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
				}
				break;
			case 'file':
				break;
			}
			break;
		case 'TEXTAREA':
			obj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
			break;
		case 'SELECT':
			switch (form.elements[i].type) {
			case 'select-one':
				obj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
				break;
			case 'select-multiple':
				for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
					if (form.elements[i].options[j].selected) {
						obj[form.elements[i].name] = encodeURIComponent(form.elements[i].options[j].value);
					}
				}
				break;
			}
			break;

		}
	}
	return obj;
}*/

var user = {first_name: "",last_name:"", sex:0, id:0};
var valueold =""


var val = (elem) => {
		console.log(elem)
		return '1';
	}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			popout: null,
			activePanel: 'newuser',
			fetchedUser: null,
			formReg: {
				sex:0,
				first_name:'',
				last_name:''
			}
		};
	}

	componentDidMount() {

		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					user=e.detail.data
					this.setState({ fetchedUser: user , formReg: {
						sex:user.sex,
						first_name:user.first_name,
						last_name:user.last_name,
						id:user.id
					}});
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}
//сохранение контекста через стрел. ф. или bind
	ChangeSt=(event)=> {
			let arr =this.state.formReg
			arr[event.target.name] = event.target.value
	    this.setState({formReg: arr } )
			console.log(this.state.formReg)
	  }

		openSheet (text) {
		    this.setState({ popout:
		      <Alert
		        actions={[{
		          title: 'Close',
		          autoclose: true,
		          style: 'destructive'
		        }, {
		          title: 'Cancel',
		          autoclose: true,
		          style: 'cancel'
		        }]}
		        onClose={ () => this.setState({ popout: null }) }
		      >
		        <h2>Hi!</h2>
		        <div className="content" dangerouslySetInnerHTML={{__html: text}}></div>
		      </Alert>
		    });
		  }


	ajaxSend=()=>{
		var data = new FormData();
		data.append( "json", JSON.stringify( this.state.formReg ) );

		fetch("https://ftvkapp.beget.tech/saveUser.php", {
    method: 'post',
    body: data
  })
  .then(res => res.text())
  .then( data=> {
    console.log('Request succeeded with response:', data);
		this.openSheet(data);
  })
  .catch(error => {
    console.log(error);
  });

	}

	go= (e)=>{
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};


	val() {
		console.dir(this)
		return '1';
	}



	render() {
let $=this.state.formReg;
		return (

<View activePanel={this.state.activePanel} popout={this.state.popout}>
  <Panel id="home" theme="white">
    <PanelHeader>Фитнес</PanelHeader>

        <Div><InfoRow title="">
           Приветствуем тебя в нашей системе
          </InfoRow>
				</Div>

	      <Div>
           <Button level="commerce" onClick={() =>this.setState({activePanel: 'newuser'})} >Регистрация</Button>
				</Div>


   </Panel>
   <Panel id="newuser" theme="white">
    <PanelHeader>Регистрация</PanelHeader>
    	 <Group>
        <Div><InfoRow title="Регистрация">
          Для регистрации просим ответить на несколько вопросов:
          </InfoRow>
			   </Div>
      </Group>
			<FormLayout id="form1">


			<Input top="Имя" name="first_name"  value={$.first_name} onChange={this.ChangeSt}/>
      <Input top="Фамилия" name="last_name" value={$.last_name} onChange={this.ChangeSt}/>

       <Select top="Пол" placeholder="Выберите пол"  name="sex" value={($.sex==2)?'m':'f'} onChange={this.ChangeSt}>
        <option value="m">Мужской</option>
        <option value="f">Женский</option>
      </Select>


	  <Select top="Цель" placeholder="Ваша цель" name="myTarget" value={$.myTarget} onChange={this.ChangeSt}>
        <option value="1">Похудение</option>
        <option value="2">Реверс</option>
        <option value="3">Набор массы</option>
      </Select>
       <Slider step={1} min={16} max={70} top={"Полных лет " + (($.old)?$.old:"") } name="old" value={Number($.old)}  onChange={val =>{$['old']=val;this.setState({formReg: $})}} />

       <Input top="Рост" type="number" name="height" value={Number($.height)} onChange={this.ChangeSt}  />
       <Input top="Вес" type="number"  name="weight" value={Number($.weight)} onChange={this.ChangeSt}/>

	<Input top="Вид спорта"  name="sport" value={$.sport} onChange={this.ChangeSt}/>
	<Input top="Часов спорта в неделю" type="number" name="hoursport" value={Number($.hoursport)} onChange={this.ChangeSt} />
	<Input top="Количество дней с тренировками" type="number" name="dayssport" value={$.dayssport} onChange={this.ChangeSt} />

	  <Select top="Телосложение" placeholder="Тип фигуры" name="typefig" value={$.typefig} onChange={this.ChangeSt} >
        <option value="1">Эктоморф/Худощавый</option>
        <option value="2">Мышечный/средний</option>
        <option value="3">Эндоморф/полный</option>
      </Select>
      <Select top="Характер работы" placeholder="Выберите" name="typefig" value={$.typefig} onChange={this.ChangeSt}>
        <option value="1">Сидячий</option>
        <option value="2">Малоактивный</option>
        <option value="3">Активный</option>
        <option value="3">Тяжелый физический труд</option>
      </Select>

    	<Select top="Уровень стресса" placeholder="Выберите" name="typefig" value={$.typefig} onChange={this.ChangeSt}>
        <option value="1">Нет стресса</option>
        <option value="2">Низкий</option>
        <option value="3">Средний</option>
        <option value="3">Тяжелый</option>
      </Select>

		<Slider step={0.5} min={4} max={14} top={"Количество часов сна в среднем " + (($.sleep)?$.sleep:"") } value={Number($.sleep)} onChange={val =>{$['sleep']=val;this.setState({formReg: $})}} />


		 { this.state.target==1 ?
       <Select top="Вы растолстели быстро (3-6 мес.) или вес/жир копился годами?" placeholder="Выберите"
				 name="fatquick" value={$.fatquick} onChange={this.ChangeSt}>
        <option value="1">Быстро</option>
        <option value="2">Медленно</option>
      	</Select>: null }
      	 { this.state.target==1 ?
      	<Select top="Были ли Вы в детстве полным ребенком?" placeholder="Выберите"
					name="fatchild" value={$.fatchild} onChange={this.ChangeSt}>
        <option value="1">Нет</option>
        <option value="2">Да</option>
      	</Select> : null }

		<Input type="email" top="E-mail" name="email" value={$.email} onChange={this.ChangeSt} />

      <Checkbox>Согласен со всем <Link>этим</Link></Checkbox>
      <Button size="xl" onClick={() =>this.setState({activePanel: 'measurement'})}>Перейти к измерениям</Button>
    </FormLayout>
  </Panel>
  <Panel id="measurement" theme="white">
    <PanelHeader>Измерения</PanelHeader>
 			 <Div>
					<InfoRow title="">
				Измерьте свои характеристики согласно инструкциям на картинках
				</InfoRow>
         <div style={{'text-align': "center"}}>
           <br /><img src='https://moiglaza.com/wp-content/uploads/2017/03/lehglau-300x210.jpg' />
         </div>
         <Input top="Обхват шеи, см"  type="number"  />

         <div style={{'text-align': "center"}}>
           <br /><img src='https://moiglaza.com/wp-content/uploads/2017/03/lehglau-300x210.jpg' />
         </div>
         <Input top="Обхват талии, см"  type="number"  />
	 { this.state.sex==1 ?
         <div style={{'text-align': "center"}} >
           <br /><img src='https://moiglaza.com/wp-content/uploads/2017/03/lehglau-300x210.jpg' />


           <Input  top="Обхват бедер, см"  type="number"  />
				 	</div>
					:''}
				 </Div>
 				 <Div>
					 <Button level="outline" onClick={() =>this.setState({activePanel: 'newuser'})} style={{ marginRight: 8 }}>Назад</Button>
           <Button level="commerce" onClick={() =>this.ajaxSend()}  >Завершить регистрацию</Button>
				</Div>


   </Panel>
</View>


		);
	}
}

export default App;
